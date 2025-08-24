/**
 * Web App entry. Routes actions and returns JSON.
 */
function doPost(e) {
  let res = {};
  try {
    if (!e || !e.postData || !e.postData.contents) throw new Error("empty body");
    const req = JSON.parse(e.postData.contents || "{}");
    const act = req.action, p = req.params || {};
    if (!act) throw new Error("missing action");

    switch (act) {
      case "create_calendar_events": res = calCreate(p); break;
      case "send_email":            res = mailSend(p);   break;
      case "update_sheet":          res = shUpd(p);      break;
      default: throw new Error("unsupported action: " + act);
    }
    res.status = res.status || "success";
  } catch (err) {
    res = { status: "error", message: String(err && err.message ? err.message : err) };
    Logger.log(err);
  }
  return ContentService.createTextOutput(JSON.stringify(res))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ======================= Helpers ======================= */

const _TZ = Session.getScriptTimeZone();

/** yyyy-MM-dd (script TZ) */
function _todayISO() {
  return Utilities.formatDate(new Date(), _TZ, "yyyy-MM-dd");
}

/** ensure yyyy-MM-dd; default today */
function _baseDateISO(d) {
  const iso = (d && typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) ? d : _todayISO();
  return iso;
}

/** parse "HH:mm", "H:mm", or "h[:mm] AM/PM" → {h,m} */
function _parseTime(t) {
  if (!t) return { h: 9, m: 0 };
  t = String(t).trim();
  let m = t.match(/^(\d{1,2}):(\d{2})$/);
  if (m) {
    const hh = Math.min(23, Math.max(0, parseInt(m[1], 10)));
    const mm = Math.min(59, Math.max(0, parseInt(m[2], 10)));
    return { h: hh, m: mm };
  }
  m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (m) {
    let hh = parseInt(m[1], 10);
    const mm = m[2] ? parseInt(m[2], 10) : 0;
    const ap = m[3].toUpperCase();
    if (ap === "PM" && hh < 12) hh += 12;
    if (ap === "AM" && hh === 12) hh = 0;
    return { h: Math.min(23, Math.max(0, hh)), m: Math.min(59, Math.max(0, mm)) };
  }
  return { h: 9, m: 0 };
}

/** Date from ISO yyyy-MM-dd in script TZ at HH:mm */
function _dtFromISO(iso, hh, mm) {
  // Build a Date in script TZ by composing parts
  const y = +iso.slice(0, 4), mo = +iso.slice(5, 7) - 1, d = +iso.slice(8, 10);
  const dt = new Date(y, mo, d, hh, mm, 0, 0);
  return dt;
}

/** next (or same) weekday from base date. JS getDay: Sun=0..Sat=6 */
function _nextWeekday(baseDt, targetDow) {
  const b = new Date(baseDt.getFullYear(), baseDt.getMonth(), baseDt.getDate());
  const diff = (targetDow - b.getDay() + 7) % 7;
  const out = new Date(b);
  out.setDate(b.getDate() + diff);
  return out;
}

/* ======================= Calendar ======================= */

function calCreate(p) {
  const calId = p.calendar_id || "primary";
  const cal = (calId === "primary") ? CalendarApp.getDefaultCalendar() : CalendarApp.getCalendarById(calId);
  if (!cal) throw new Error("calendar not found: " + calId);

  const baseISO = _baseDateISO(p.start_date);
  const evs = Array.isArray(p.events) ? p.events : [];
  if (evs.length === 0) throw new Error("no events");

  const dayMap = { "sunday":0, "monday":1, "tuesday":2, "wednesday":3, "thursday":4, "friday":5, "saturday":6 };
  const made = [];

  evs.forEach(ev => {
    const ttl = ev.title || "Untitled";
    const tm = _parseTime(ev.time);
    const dur = Math.max(1, parseInt(ev.duration_minutes || 30, 10));

    // Base date = start_date in TZ
    let evDate = _dtFromISO(baseISO, 0, 0);

    // If day provided, jump to that weekday (same-or-next)
    if (ev.day && dayMap[String(ev.day).toLowerCase()] !== undefined) {
      const target = dayMap[String(ev.day).toLowerCase()];
      evDate = _nextWeekday(evDate, target);
    }
    // Set time
    evDate.setHours(tm.h, tm.m, 0, 0);

    const st = new Date(evDate.getTime());
    const en = new Date(st.getTime() + dur * 60000);

    const ce = cal.createEvent(ttl, st, en, {
      description: ev.description || "",
      location: ev.location || ""
    });

    made.push({
      id: ce.getId(),
      title: ce.getTitle(),
      startTime: ce.getStartTime().toISOString(),
      endTime: ce.getEndTime().toISOString()
    });
  });

  return {
    status: "success",
    message: "created " + made.length + " calendar event(s)",
    created_events_count: made.length,
    events: made
  };
}

/* ======================= Gmail ======================= */

function mailSend(p) {
  const to = p.recipient, sub = p.subject, bod = p.body;
  if (!to || !sub || !bod) throw new Error("missing recipient/subject/body");
  GmailApp.sendEmail(to, sub, bod);
  return { status: "success", message: "email sent to " + to };
}

/* ======================= Sheets ======================= */

function shUpd(p) {
  const ssId = p.spreadsheet_id, shName = p.sheet_name, start = p.start_cell, vals = p.values;
  if (!ssId || !shName || !start || !vals) throw new Error("missing spreadsheet_id/sheet_name/start_cell/values");
  if (!Array.isArray(vals) || !Array.isArray(vals[0])) throw new Error("values must be 2D array");

  const ss = SpreadsheetApp.openById(ssId);
  const sh = ss.getSheetByName(shName);
  if (!sh) throw new Error("sheet not found: " + shName);

  const rows = vals.length, cols = vals[0].length;
  sh.getRange(start).offset(0, 0, rows, cols).setValues(vals);

  return { status: "success", message: "sheet updated", rows_written: rows, cols_written: cols };
}

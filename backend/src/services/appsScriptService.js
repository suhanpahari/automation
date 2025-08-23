const { google } = require('googleapis');

class AppsScriptService {
    constructor(auth) {
        this.auth = auth;
        this.script = google.script({ version: 'v1', auth: this.auth });
    }

    async executeScript(scriptId, requestBody) {
        try {
            const response = await this.script.scripts.run({
                scriptId: scriptId,
                resource: {
                    function: 'yourFunctionName', // Replace with your function name
                    parameters: requestBody,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error executing Apps Script:', error);
            throw new Error('Failed to execute Apps Script');
        }
    }
}

module.exports = AppsScriptService;
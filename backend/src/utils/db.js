const { Pool } = require('pg');
const admin = require('firebase-admin');
const serviceAccount = require('../../path/to/serviceAccountKey.json'); // Update with the correct path

let db;

const initializeFirestore = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    db = admin.firestore();
};

const initializePostgres = () => {
    db = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });
};

const connectToDatabase = () => {
    if (process.env.DB_TYPE === 'firestore') {
        initializeFirestore();
    } else if (process.env.DB_TYPE === 'postgres') {
        initializePostgres();
    } else {
        throw new Error('Unsupported database type');
    }
};

const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized. Call connectToDatabase first.');
    }
    return db;
};

module.exports = {
    connectToDatabase,
    getDb,
};
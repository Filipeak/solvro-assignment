const admin = require("firebase-admin");
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccountString = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, "base64").toString('utf-8');
const serviceAccount = JSON.parse(serviceAccountString);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = getFirestore();

module.exports.getDatabase = () => {
    return db;
};
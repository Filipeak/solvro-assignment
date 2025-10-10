// TODO: Unit tests, github actions, readme

const request = require('supertest');
const admin = require("firebase-admin");
const serviceAccount = require("../keys/firebaseServiceAccountKey.json");

process.env['FIRESTORE_EMULATOR_HOST'] = '127.0.0.1:8080';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

test("Cocktails API", async () => {
    const docs = await db.collection("cocktails").listDocuments();

    console.log(docs.length);
});
import * as admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
dotenv.config();
const firestoreDBServiceAccount = require(path.resolve(
  __dirname,
  "./marketingai-db-firebase-adminsdk-q9xbn-a5ecea4edf.json"
));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firestoreDBServiceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
  console.log("Firebase initialized");
} else {
  admin.app();
  console.log("Using existing Firebase app");
}

const db = admin.firestore();

export { db };

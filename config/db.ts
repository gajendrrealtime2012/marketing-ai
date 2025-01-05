import * as admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
dotenv.config();
const firestoreDBServiceAccount = require(path.resolve(
  __dirname,
  "./marketingai-db-firestore-service-account.json"
));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firestoreDBServiceAccount),
  });
  console.log("Firebase initialized");
} else {
  admin.app();
  console.log("Using existing Firebase app");
}

const db = admin.firestore();

export { db };

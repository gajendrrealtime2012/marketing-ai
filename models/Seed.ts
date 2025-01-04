import { db } from "../config/db";
import { Timestamp } from "@google-cloud/firestore";

interface Attachment {
  url: string;
  description?: string;
}

interface Seed {
  seed_url: string;
  seed: string;
  attachments: Attachment[];
  created_at: FirebaseFirestore.Timestamp;
  updated_at: FirebaseFirestore.Timestamp;
}

const addSeed = async (seed: Omit<Seed, "created_at" | "updated_at">) => {
  const now = Timestamp.now();
  const seedRef = db.collection("seeds").doc();
  await seedRef.set({
    ...seed,
    created_at: now,
    updated_at: now,
  });
};

export { addSeed, Seed };

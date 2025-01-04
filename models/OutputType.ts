// Example of adding an OutputType document to Firestore
import { firestore } from "firebase-admin";

const db = firestore();

interface Section {
  name: string;
  instruction?: string;
}

interface OutputType {
  output_type_name: string;
  description?: string;
  sections: Section[];
  created_at: FirebaseFirestore.Timestamp;
  updated_at: FirebaseFirestore.Timestamp;
}

const addOutputType = async (
  outputType: Omit<OutputType, "created_at" | "updated_at">
) => {
  const now = firestore.Timestamp.now();
  const outputTypeRef = db.collection("outputTypes").doc();
  await outputTypeRef.set({
    ...outputType,
    created_at: now,
    updated_at: now,
  });
};

export { addOutputType, OutputType };

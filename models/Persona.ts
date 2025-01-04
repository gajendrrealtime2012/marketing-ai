import { db } from "../config/db";
import { Timestamp } from "@google-cloud/firestore";

interface Persona {
  name: string;
  description?: string;
  instructions?: string;
  created_at: FirebaseFirestore.Timestamp;
  updated_at: FirebaseFirestore.Timestamp;
}

const addPersona = async (persona: Persona) => {
  try {
    const personaRef = db.collection("personas").doc();
    const now = Timestamp.now();

    await personaRef.set({
      ...persona,
      created_at: persona.created_at || now,
      updated_at: persona.updated_at || now,
    });

    console.log("Persona added successfully");
  } catch (error) {
    console.error("Error adding persona:", error);
  }
};

export { addPersona, Persona };

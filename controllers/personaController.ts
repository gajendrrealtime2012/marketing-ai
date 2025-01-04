import { Request, Response } from "express";
import { db } from "../config/db";

interface Persona {
  id: string;
}

// Get all personas
export const getAllPersonas = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const personasRef = db.collection("personas");
    const snapshot = await personasRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No personas found" });
    }

    const personas: Persona[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Persona[];
    return res.status(200).json(personas);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unknown error occurred" });
  }
};

// Create a new persona
export const createPersona = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const newPersonaData: Omit<Persona, "created_at" | "updated_at"> = req.body;

    const personaRef = db.collection("personas").doc();
    await personaRef.set({
      ...newPersonaData,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.status(201).json({ message: "Persona created successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unknown error occurred" });
  }
};

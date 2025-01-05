import { Request, Response } from "express";
import { db } from "../config/db";
import { Seed } from "../models/Seed";

// Get all seeds
export const getAllSeeds = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const seedsRef = db.collection("seeds");
    const snapshot = await seedsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No seeds found" });
    }

    const seeds: Seed[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Seed[];
    return res.status(200).json(seeds);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unknown error occurred" });
  }
};

// Create a new seed
export const createSeed = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const newSeedData: Omit<Seed, "id" | "created_at" | "updated_at"> =
      req.body;
    const seedRef = db.collection("seeds").doc();
    await seedRef.set({
      ...newSeedData,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.status(201).json({ message: "Seed created successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unknown error occurred" });
  }
};

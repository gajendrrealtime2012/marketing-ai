import { Request, Response } from "express";
import { db } from "../config/db";
import { Tuned } from "../models/Tuned";

// Get all tuned data
export const getAllTunedData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const tunedDataRef = db.collection("tuneds");
    const snapshot = await tunedDataRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No tuned data found" });
    }

    const tunedData: Tuned[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Tuned[];
    return res.status(200).json(tunedData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unknown error occurred" });
  }
};

// Save tuned data
export const saveTunedData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const newTunedData: Omit<Tuned, "id" | "created_at" | "updated_at"> =
      req.body;
    const tunedDataRef = db.collection("tuneds").doc();
    await tunedDataRef.set({
      ...newTunedData,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.status(201).json({ message: "Tuned data saved successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unknown error occurred" });
  }
};

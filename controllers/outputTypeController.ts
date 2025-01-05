import { Request, Response } from "express";
import { db } from "../config/db";
import { OutputType } from "../models/OutputType";

export const getAllOutputTypes = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const outputTypesRef = db.collection("outputTypes");
    const snapshot = await outputTypesRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No output types found" });
    }

    const outputTypes: OutputType[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as OutputType[];
    return res.status(200).json(outputTypes);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unknown error occurred" });
  }
};

export const createOutputType = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const newOutputTypeData: Omit<
      OutputType,
      "id" | "created_at" | "updated_at"
    > = req.body;

    const outputTypeRef = db.collection("outputTypes").doc();
    await outputTypeRef.set({
      ...newOutputTypeData,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res
      .status(201)
      .json({ message: "Output Type created successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unknown error occurred" });
  }
};

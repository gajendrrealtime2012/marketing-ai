import { Request, Response } from "express";
import { db } from "../config/db";
const generativeModel = require("../config/vertexAIConfig");
const generativeTunedModel = require("../config/vertexAITunedConfig");
const generatePrompt = require("../utils/generatePrompt");
const writeToJSONL = require("../utils/writeToJSONL");

interface Section {
  name: string;
  instruction: string;
}

export const generateContent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { personaId, outputTypeId, seedId } = req.body;

  if (!personaId || !outputTypeId || !seedId) {
    return res
      .status(400)
      .json({ error: "ID for persona, output_type, and seed are required." });
  }

  const personasRef = db.collection("personas").doc(personaId);
  const snapshotPersona = await personasRef.get();

  if (!snapshotPersona.exists) {
    return res.status(404).json({ message: "No personas found" });
  }

  const persona = snapshotPersona.data();

  const seedsRef = db.collection("seeds").doc(seedId);
  const snapshotSeed = await seedsRef.get();

  if (!snapshotSeed.exists) {
    return res.status(404).json({ message: "No seeds found" });
  }

  const seed = snapshotSeed.data();

  const outputTypeRef = db.collection("outputTypes").doc(outputTypeId);
  const snapshotOutputType = await outputTypeRef.get();

  if (!snapshotOutputType.exists) {
    return res.status(404).json({ message: "No output type found" });
  }

  const output_type = snapshotOutputType.data();

  try {
    const prompt = generatePrompt(persona, output_type, seed);
    const response = await generativeModel.generateContentStream(prompt);

        try {
      await writeToJSONL(persona, output_type, seed, response);
      console.log("Data successfully written to JSONL.");
    } catch (writeError) {
      console.error("Error writing to JSONL:", writeError);
      return res.status(500).json({ error: "Failed to write to JSONL file" });
    }

    return res.status(200).json({
      data: (await response.response).candidates[0].content.parts[0].text,
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return res.status(500).json({ error: "Failed to generate content" });
  }
};

export const tuneBySeedContent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { seedId } = req.body;

  if (!seedId) {
    return res.status(400).json({ error: "Seed ID is required." });
  }

  const seedsRef = db.collection("seeds").doc(seedId);
  const snapshotSeed = await seedsRef.get();

  if (!snapshotSeed.exists) {
    return res.status(404).json({ message: "No seed found" });
  }

  const seed = snapshotSeed.data();

  try {
    const prompt = seed
      ? {
          text: `Seed Data:
      Seed URL: ${seed.seed_url}
      Description: ${seed.seed}`,
        }
      : {
          text: "Seed Data is unavailable",
        };

    const chat = generativeTunedModel.startChat({});
    const streamResult = await chat.sendMessageStream([prompt]);
    const generatedText = (await streamResult.response).candidates[0].content
      .parts[0].text;

    return res.status(200).json({ data: generatedText });
  } catch (error) {
    console.error("Error tuning content:", error);
    return res.status(500).json({ error: "Failed to tune content" });
  }
};

export const tuneByPersonaContent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { personaId } = req.body;

  if (!personaId) {
    return res.status(400).json({ error: "Persona ID is required." });
  }

  const personasRef = db.collection("personas").doc(personaId);
  const snapshotPersona = await personasRef.get();

  if (!snapshotPersona.exists) {
    return res.status(404).json({ message: "No personas found" });
  }

  const persona = snapshotPersona.data();
  try {
    const prompt = persona
      ? {
          text: `Persona: ${persona.name}
  Description: ${persona.description}
  Instructions: ${persona.instructions}`,
        }
      : {
          text: "Persona Data is unavailable",
        };

    const chat = generativeTunedModel.startChat({});
    const streamResult = await chat.sendMessageStream([prompt]);
    const generatedText = (await streamResult.response).candidates[0].content
      .parts[0].text;

    return res.status(200).json({ data: generatedText });
  } catch (error) {
    console.error("Error tuning persona content:", error);
    return res.status(500).json({ error: "Failed to tune persona content" });
  }
};

export const tuneByOutputTypeContent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { outputTypeId } = req.body;

  if (!outputTypeId) {
    return res.status(400).json({ error: "Output type ID is required." });
  }

  const outputTypeRef = db.collection("outputTypes").doc(outputTypeId);
  const snapshotOutputType = await outputTypeRef.get();

  if (!snapshotOutputType.exists) {
    return res.status(404).json({ message: "No output type found" });
  }

  const output_type = snapshotOutputType.data();
  try {
    const prompt = output_type
      ? {
          text: `Output Type: ${output_type.output_type_name}
    Description: ${output_type.description}
    Sections:
    ${output_type.sections
      .map(
        (section: Section, index: number) =>
          `${index + 1}. ${section.name} - ${section.instruction}`
      )
      .join("\n")}`,
        }
      : {
          text: "Output type Data is unavailable",
        };

    const chat = generativeTunedModel.startChat({});
    const streamResult = await chat.sendMessageStream([prompt]);
    const generatedText = (await streamResult.response).candidates[0].content
      .parts[0].text;

    return res.status(200).json({ data: generatedText });
  } catch (error) {
    console.error("Error tuning output type content:", error);
    return res
      .status(500)
      .json({ error: "Failed to tune output type content" });
  }
};

export const tuneByAllThreeContent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { personaId, outputTypeId, seedId } = req.body;

  if (!personaId || !outputTypeId || !seedId) {
    return res
      .status(400)
      .json({ error: "ID for persona, output_type, and seed are required." });
  }

  const personasRef = db.collection("personas").doc(personaId);
  const snapshotPersona = await personasRef.get();

  if (!snapshotPersona.exists) {
    return res.status(404).json({ message: "No personas found" });
  }

  const seedsRef = db.collection("seeds").doc(seedId);
  const snapshotSeed = await seedsRef.get();

  if (!snapshotSeed.exists) {
    return res.status(404).json({ message: "No seeds found" });
  }

  const outputTypeRef = db.collection("outputTypes").doc(outputTypeId);
  const snapshotOutputType = await outputTypeRef.get();

  if (!snapshotOutputType.exists) {
    return res.status(404).json({ message: "No output type found" });
  }

  const persona = snapshotPersona.data();
  const output_type = snapshotOutputType.data();
  const seed = snapshotSeed.data();
  try {
    const prompt =
      output_type && persona && seed
        ? {
            text: `Persona: ${persona.name}
          Description: ${persona.description}
          Instructions: ${persona.instructions}
    
          Output Type: ${output_type.output_type_name}
          Description: ${output_type.description}
          Sections:
          ${output_type.sections
            .map(
              (section: Section, index: number) =>
                `${index + 1}. ${section.name} - ${section.instruction}`
            )
            .join("\n")}
    
          Seed Data:
          Seed URL: ${seed.seed_url}
          Description: ${seed.seed}`,
          }
        : {
            text: "Persona, Output type & Seed Data is unavailable",
          };

    const chat = generativeTunedModel.startChat({});
    const streamResult = await chat.sendMessageStream([prompt]);
    const generatedText = (await streamResult.response).candidates[0].content
      .parts[0].text;

    return res.status(200).json({ data: generatedText });
  } catch (error) {
    console.error("Error tuning content:", error);
    return res.status(500).json({ error: "Failed to tune content" });
  }
};


export const tuneByAllThreeContent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { personaId, outputTypeId, seedId } = req.body;

  if (!personaId || !outputTypeId || !seedId) {
    return res
      .status(400)
      .json({ error: "ID for persona, output_type, and seed are required." });
  }

  const personasRef = db.collection("personas").doc(personaId);
  const snapshotPersona = await personasRef.get();

  if (!snapshotPersona.exists) {
    return res.status(404).json({ message: "No personas found" });
  }

  const seedsRef = db.collection("seeds").doc(seedId);
  const snapshotSeed = await seedsRef.get();

  if (!snapshotSeed.exists) {
    return res.status(404).json({ message: "No seeds found" });
  }

  const outputTypeRef = db.collection("outputTypes").doc(outputTypeId);
  const snapshotOutputType = await outputTypeRef.get();

  if (!snapshotOutputType.exists) {
    return res.status(404).json({ message: "No output type found" });
  }

  const persona = snapshotPersona.data();
  const output_type = snapshotOutputType.data();
  const seed = snapshotSeed.data();
  try {
    const prompt =
      output_type && persona && seed
        ? {
            text: `Persona: ${persona.name}
          Description: ${persona.description}
          Instructions: ${persona.instructions}
    
          Output Type: ${output_type.output_type_name}
          Description: ${output_type.description}
          Sections:
          ${output_type.sections
            .map(
              (section: Section, index: number) =>
                `${index + 1}. ${section.name} - ${section.instruction}`
            )
            .join("\n")}
    
          Seed Data:
          Seed URL: ${seed.seed_url}
          Description: ${seed.seed}`,
          }
        : {
            text: "Persona, Output type & Seed Data is unavailable",
          };

    const chat = generativeTunedModel.startChat({});
    const streamResult = await chat.sendMessageStream([prompt]);
    const generatedText = (await streamResult.response).candidates[0].content
      .parts[0].text;

    return res.status(200).json({ data: generatedText });
  } catch (error) {
    console.error("Error tuning content:", error);
    return res.status(500).json({ error: "Failed to tune content" });
  }
};

export const tuneAllBySingleSection = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { personaId, outputTypeId, seedId, sectionName } = req.body;

  if (!personaId || !outputTypeId || !seedId || !sectionName) {
    return res.status(400).json({
      error:
        "ID for persona, output_type, seed, and section name are required.",
    });
  }

  const personasRef = db.collection("personas").doc(personaId);
  const snapshotPersona = await personasRef.get();

  if (!snapshotPersona.exists) {
    return res.status(404).json({ message: "No personas found" });
  }

  const seedsRef = db.collection("seeds").doc(seedId);
  const snapshotSeed = await seedsRef.get();

  if (!snapshotSeed.exists) {
    return res.status(404).json({ message: "No seeds found" });
  }

  const outputTypeRef = db.collection("outputTypes").doc(outputTypeId);
  const snapshotOutputType = await outputTypeRef.get();

  if (!snapshotOutputType.exists) {
    return res.status(404).json({ message: "No output type found" });
  }

  const persona = snapshotPersona.data();
  const output_type = snapshotOutputType.data();
  const seed = snapshotSeed.data();

  try {
    // Filter the sections array to include only the specified section
    const filteredSections =
      output_type?.sections?.filter(
        (section: { name: string }) => section.name === sectionName
      ) || [];

    if (filteredSections.length === 0) {
      return res.status(404).json({ message: "No matching section found" });
    }

    const prompt =
      output_type && persona && seed
        ? {
            text: `Persona: ${persona.name}
          Description: ${persona.description}
          Instructions: ${persona.instructions}
    
          Output Type: ${output_type.output_type_name}
          Description: ${output_type.description}
          Sections:
          ${filteredSections
            .map(
              (section: { name: string; instruction: string }, index: number) =>
                `${index + 1}. ${section.name} - ${section.instruction}`
            )
            .join("\n")}
    
          Seed Data:
          Seed URL: ${seed.seed_url}
          Description: ${seed.seed}`,
          }
        : {
            text: "Persona, Output type & Seed Data is unavailable",
          };

    const chat = generativeTunedModel.startChat({});
    const streamResult = await chat.sendMessageStream([prompt]);
    const generatedText = (await streamResult.response).candidates[0].content
      .parts[0].text;

    return res.status(200).json({ data: generatedText });
  } catch (error) {
    console.error("Error tuning content:", error);
    return res.status(500).json({ error: "Failed to tune content" });
  }
};

export const tuneBySingleSection = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { outputTypeId, sectionName } = req.body;

  if (!outputTypeId || !sectionName) {
    return res.status(400).json({
      error: "ID for output_type and section name are required.",
    });
  }

  const outputTypeRef = db.collection("outputTypes").doc(outputTypeId);
  const snapshotOutputType = await outputTypeRef.get();

  if (!snapshotOutputType.exists) {
    return res.status(404).json({ message: "No output type found" });
  }

  const output_type = snapshotOutputType.data();

  try {
    const filteredSections =
      output_type?.sections?.filter(
        (section: { name: string }) => section.name === sectionName
      ) || [];

    if (filteredSections.length === 0) {
      return res.status(404).json({ message: "No matching section found" });
    }

    const prompt = output_type
      ? {
          text: `
          Output Type: ${output_type.output_type_name}
          Description: ${output_type.description}
          Sections:
          ${filteredSections
            .map(
              (section: { name: string; instruction: string }, index: number) =>
                `${index + 1}. ${section.name} - ${section.instruction}`
            )
            .join("\n")}`,
        }
      : {
          text: "Persona, Output type & Seed Data is unavailable",
        };

    const chat = generativeTunedModel.startChat({});
    const streamResult = await chat.sendMessageStream([prompt]);
    const generatedText = (await streamResult.response).candidates[0].content
      .parts[0].text;

    return res.status(200).json({ data: generatedText });
  } catch (error) {
    console.error("Error tuning content:", error);
    return res.status(500).json({ error: "Failed to tune content" });
  }
};


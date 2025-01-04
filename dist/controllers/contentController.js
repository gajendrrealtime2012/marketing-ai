"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tuneByAllThreeContent = exports.tuneByOutputTypeContent = exports.tuneByPersonaContent = exports.tuneBySeedContent = exports.generateContent = void 0;
const db_1 = require("../config/db");
const generativeModel = require("../config/vertexAIConfig");
const generativeTunedModel = require("../config/vertexAITunedConfig");
const generatePrompt = require("../utils/generatePrompt");
const writeToJSONL = require("../utils/writeToJSONL");
const generateContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { personaId, outputTypeId, seedId } = req.body;
    if (!personaId || !outputTypeId || !seedId) {
        return res
            .status(400)
            .json({ error: "ID for persona, output_type, and seed are required." });
    }
    const personasRef = db_1.db.collection("personas").doc(personaId);
    const snapshotPersona = yield personasRef.get();
    if (!snapshotPersona.exists) {
        return res.status(404).json({ message: "No personas found" });
    }
    const persona = snapshotPersona.data();
    const seedsRef = db_1.db.collection("seeds").doc(seedId);
    const snapshotSeed = yield seedsRef.get();
    if (!snapshotSeed.exists) {
        return res.status(404).json({ message: "No seeds found" });
    }
    const seed = snapshotSeed.data();
    const outputTypeRef = db_1.db.collection("outputTypes").doc(outputTypeId);
    const snapshotOutputType = yield outputTypeRef.get();
    if (!snapshotOutputType.exists) {
        return res.status(404).json({ message: "No output type found" });
    }
    const output_type = snapshotOutputType.data();
    try {
        const prompt = generatePrompt(persona, output_type, seed);
        const response = yield generativeModel.generateContentStream(prompt);
        yield writeToJSONL(persona, output_type, seed, response);
        return res.status(200).json({
            data: (yield response.response).candidates[0].content.parts[0].text,
        });
    }
    catch (error) {
        console.error("Error generating content:", error);
        return res.status(500).json({ error: "Failed to generate content" });
    }
});
exports.generateContent = generateContent;
const tuneBySeedContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { seedId } = req.body;
    if (!seedId) {
        return res.status(400).json({ error: "Seed ID is required." });
    }
    const seedsRef = db_1.db.collection("seeds").doc(seedId);
    const snapshotSeed = yield seedsRef.get();
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
        const streamResult = yield chat.sendMessageStream([prompt]);
        const generatedText = (yield streamResult.response).candidates[0].content
            .parts[0].text;
        return res.status(200).json({ data: generatedText });
    }
    catch (error) {
        console.error("Error tuning content:", error);
        return res.status(500).json({ error: "Failed to tune content" });
    }
});
exports.tuneBySeedContent = tuneBySeedContent;
const tuneByPersonaContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { personaId } = req.body;
    if (!personaId) {
        return res.status(400).json({ error: "Persona ID is required." });
    }
    const personasRef = db_1.db.collection("personas").doc(personaId);
    const snapshotPersona = yield personasRef.get();
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
        const streamResult = yield chat.sendMessageStream([prompt]);
        const generatedText = (yield streamResult.response).candidates[0].content
            .parts[0].text;
        return res.status(200).json({ data: generatedText });
    }
    catch (error) {
        console.error("Error tuning persona content:", error);
        return res.status(500).json({ error: "Failed to tune persona content" });
    }
});
exports.tuneByPersonaContent = tuneByPersonaContent;
const tuneByOutputTypeContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { outputTypeId } = req.body;
    if (!outputTypeId) {
        return res.status(400).json({ error: "Output type ID is required." });
    }
    const outputTypeRef = db_1.db.collection("outputTypes").doc(outputTypeId);
    const snapshotOutputType = yield outputTypeRef.get();
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
                    .map((section, index) => `${index + 1}. ${section.name} - ${section.instruction}`)
                    .join("\n")}`,
            }
            : {
                text: "Output type Data is unavailable",
            };
        const chat = generativeTunedModel.startChat({});
        const streamResult = yield chat.sendMessageStream([prompt]);
        const generatedText = (yield streamResult.response).candidates[0].content
            .parts[0].text;
        return res.status(200).json({ data: generatedText });
    }
    catch (error) {
        console.error("Error tuning output type content:", error);
        return res
            .status(500)
            .json({ error: "Failed to tune output type content" });
    }
});
exports.tuneByOutputTypeContent = tuneByOutputTypeContent;
const tuneByAllThreeContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { personaId, outputTypeId, seedId } = req.body;
    if (!personaId || !outputTypeId || !seedId) {
        return res
            .status(400)
            .json({ error: "ID for persona, output_type, and seed are required." });
    }
    const personasRef = db_1.db.collection("personas").doc(personaId);
    const snapshotPersona = yield personasRef.get();
    if (!snapshotPersona.exists) {
        return res.status(404).json({ message: "No personas found" });
    }
    const seedsRef = db_1.db.collection("seeds").doc(seedId);
    const snapshotSeed = yield seedsRef.get();
    if (!snapshotSeed.exists) {
        return res.status(404).json({ message: "No seeds found" });
    }
    const outputTypeRef = db_1.db.collection("outputTypes").doc(outputTypeId);
    const snapshotOutputType = yield outputTypeRef.get();
    if (!snapshotOutputType.exists) {
        return res.status(404).json({ message: "No output type found" });
    }
    const persona = snapshotPersona.data();
    const output_type = snapshotOutputType.data();
    const seed = snapshotSeed.data();
    try {
        const prompt = output_type && persona && seed
            ? {
                text: `Persona: ${persona.name}
          Description: ${persona.description}
          Instructions: ${persona.instructions}
    
          Output Type: ${output_type.output_type_name}
          Description: ${output_type.description}
          Sections:
          ${output_type.sections
                    .map((section, index) => `${index + 1}. ${section.name} - ${section.instruction}`)
                    .join("\n")}
    
          Seed Data:
          Seed URL: ${seed.seed_url}
          Description: ${seed.seed}`,
            }
            : {
                text: "Persona, Output type & Seed Data is unavailable",
            };
        const chat = generativeTunedModel.startChat({});
        const streamResult = yield chat.sendMessageStream([prompt]);
        const generatedText = (yield streamResult.response).candidates[0].content
            .parts[0].text;
        return res.status(200).json({ data: generatedText });
    }
    catch (error) {
        console.error("Error tuning content:", error);
        return res.status(500).json({ error: "Failed to tune content" });
    }
});
exports.tuneByAllThreeContent = tuneByAllThreeContent;

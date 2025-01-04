import { VertexAI } from "@google-cloud/vertexai";
import dotenv from "dotenv";

dotenv.config();

const vertexAIClient = new VertexAI({
  project: process.env.GCP_PROJECT,
  location: process.env.GCP_LOCATION,
});

const generativeModel = vertexAIClient.preview.getGenerativeModel({
  model: process.env.MODEL_NAME as string,
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 0.2,
    topP: 0.95,
  },
});

module.exports = generativeModel;
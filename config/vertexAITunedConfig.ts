import { VertexAI } from "@google-cloud/vertexai";
import dotenv from "dotenv";
dotenv.config();

const vertex_ai = new VertexAI({
  project: process.env.GCP_TUNED_MODEL_PROJECT_ID,
  location: process.env.GCP_TUNED_MODEL_LOCATION,
});

const model = process.env.GCP_TUNED_MODEL;

const generativeTunedModel = vertex_ai.preview.getGenerativeModel({
  model: model as string,
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 0.5,
    topP: 0.95,
  },
});

module.exports = generativeTunedModel;

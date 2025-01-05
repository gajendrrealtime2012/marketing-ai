import { VertexAI } from "@google-cloud/vertexai";
import dotenv from "dotenv";
dotenv.config();

const vertex_ai = new VertexAI({
  project: process.env.GCP_TUNED_MODEL_PROJECT_ID,
  location: process.env.GCP_TUNED_MODEL_LOCATION,
});

const generativeTunedModel = vertex_ai.preview.getGenerativeModel({
  model:
    "projects/322771814595/locations/us-central1/endpoints/6945510499056353280",
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 0.5,
    topP: 0.95,
  },
});

module.exports = generativeTunedModel;

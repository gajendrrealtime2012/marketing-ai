"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vertexai_1 = require("@google-cloud/vertexai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const vertex_ai = new vertexai_1.VertexAI({
    project: process.env.GCP_TUNED_MODEL_PROJECT_ID,
    location: process.env.GCP_TUNED_MODEL_LOCATION,
});
const model = process.env.GCP_TUNED_MODEL;
const generativeTunedModel = vertex_ai.preview.getGenerativeModel({
    model: model,
    generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.5,
        topP: 0.95,
    },
});
module.exports = generativeTunedModel;

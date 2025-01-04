"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vertexai_1 = require("@google-cloud/vertexai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const vertexAIClient = new vertexai_1.VertexAI({
    project: process.env.GCP_PROJECT,
    location: process.env.GCP_LOCATION,
});
const generativeModel = vertexAIClient.preview.getGenerativeModel({
    model: process.env.MODEL_NAME,
    generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.2,
        topP: 0.95,
    },
});
module.exports = generativeModel;

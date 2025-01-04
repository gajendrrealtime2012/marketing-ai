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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Writes the given parameters to a JSONL file.
 *
 * @param persona - The persona details (name, description, instructions).
 * @param output_type - The output type details (output_type_name, description, sections).
 * @param seed - The seed details (seed_url, seed description).
 * @param response - The response from the model.
 * @param fileName - The name of the JSONL file (default: 'datasets_marketing.jsonl').
 */
function writeToJSONL(persona_1, output_type_1, seed_1, response_1) {
    return __awaiter(this, arguments, void 0, function* (persona, output_type, seed, response, fileName = "datasets_marketing.jsonl") {
        try {
            // Construct the JSON object
            const contents = {
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
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
                            },
                        ],
                    },
                    {
                        role: "model",
                        parts: [
                            {
                                text: (yield response.response).candidates[0].content.parts[0]
                                    .text,
                            },
                        ],
                    },
                ],
            };
            // Convert the JSON object to a single-line JSON string
            const jsonlString = JSON.stringify(contents);
            // Resolve the file path
            const filePath = path_1.default.resolve(__dirname, "..", fileName);
            // Append the JSONL string to the file
            fs_1.default.appendFileSync(filePath, jsonlString + "\n", "utf8");
            // console.log(`Data successfully written to ${fileName}`);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Failed to write to JSONL file: ${error.message}`);
            }
            else {
                console.error(`Failed to write to JSONL file: ${String(error)}`);
            }
        }
    });
}
// export default writeToJSONL;
module.exports = writeToJSONL;

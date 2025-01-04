import fs from "fs";
import path from "path";

interface Section {
  name: string;
  instruction: string;
}

interface OutputType {
  output_type_name: string;
  description: string;
  sections: Section[];
}

interface Seed {
  seed_url: string;
  seed: string;
}

interface Persona {
  name: string;
  description: string;
  instructions: string;
}

interface Response {
  response: {
    candidates: {
      content: {
        parts: {
          text: string;
        }[];
      };
    }[];
  };
}

/**
 * Writes the given parameters to a JSONL file.
 *
 * @param persona - The persona details (name, description, instructions).
 * @param output_type - The output type details (output_type_name, description, sections).
 * @param seed - The seed details (seed_url, seed description).
 * @param response - The response from the model.
 * @param fileName - The name of the JSONL file (default: 'datasets_marketing.jsonl').
 */
async function writeToJSONL(
  persona: Persona,
  output_type: OutputType,
  seed: Seed,
  response: Response,
  fileName: string = "datasets_marketing.jsonl"
): Promise<void> {
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
  .map(
    (section, index) => `${index + 1}. ${section.name} - ${section.instruction}`
  )
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
              text: (await response.response).candidates[0].content.parts[0]
                .text,
            },
          ],
        },
      ],
    };

    // Convert the JSON object to a single-line JSON string
    const jsonlString = JSON.stringify(contents);

    // Resolve the file path
    const filePath = path.resolve(__dirname, "..", fileName);

    // Append the JSONL string to the file
    fs.appendFileSync(filePath, jsonlString + "\n", "utf8");

    // console.log(`Data successfully written to ${fileName}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to write to JSONL file: ${error.message}`);
    } else {
      console.error(`Failed to write to JSONL file: ${String(error)}`);
    }
  }
}

// export default writeToJSONL;
module.exports = writeToJSONL;

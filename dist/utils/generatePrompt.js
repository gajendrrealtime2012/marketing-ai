"use strict";
const generatePrompt = (persona, output_type, seed) => ({
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
    ],
});
module.exports = generatePrompt;

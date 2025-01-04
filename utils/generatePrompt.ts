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

interface Content {
  role: string;
  parts: { text: string }[];
}

const generatePrompt = (
  persona: Persona,
  output_type: OutputType,
  seed: Seed
): { contents: Content[] } => ({
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
        (section, index) =>
          `${index + 1}. ${section.name} - ${section.instruction}`
      )
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

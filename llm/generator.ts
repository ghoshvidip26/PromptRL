import { Ollama } from "ollama";

export type Mode = "fast" | "deep";
export type Persona = "teacher" | "analyst" | "creative" | "concise";
const ollama = new Ollama({
  host: "http://host.docker.internal:11434",
});

export async function generateResponse(
  prompt: string,
  model: string,
  mode: Mode,
  persona: Persona,
) {
  const systemPrompt = `
You are an AI assistant.

Your role:
- Persona: ${persona}
- Thinking Mode: ${mode}

Guidelines:
- Always prioritize completing the user's task accurately
- Apply persona style ONLY in tone (not content distortion)
- Do NOT overcomplicate simple tasks

Persona behavior:
- teacher → clear, simple explanations
- analyst → structured and logical
- creative → engaging and expressive
- concise → brief and direct

Thinking mode:
- fast → short, efficient response
- deep → detailed and well reasoned

IMPORTANT:
- Do NOT ignore the task
- Do NOT add unnecessary explanation unless required
`;
  const instructions = {
    teacher: "Explain everything simply and logically.",
    analyst: "Deconstruct the input and look for data points.",
    creative: "Focus on vivid imagery and unique metaphors.",
    concise: "Answer as briefly as possible with zero fluff.",
  };

  const depth =
    mode === "deep"
      ? "Focus on deep, chain-of-thought reasoning before concluding. Show your work."
      : "Think rapidly and skip internal reasoning.";

  const fullPrompt = `Persona: ${instructions[persona]}\nReasoning level: ${depth}\n\nTask: ${prompt}
  Respond appropriately based on the task.
`;

  const res = await ollama.chat({
    model:
      model === "llama3.1"
        ? "llama3.1"
        : model === "llama3.2"
          ? "llama3.2"
          : "qwen2.5",
    messages: [
      {
        role: "user",
        content: fullPrompt,
      },
      {
        role: "system",
        content: systemPrompt,
      },
    ],
    options: {
      temperature: 0.7,
      num_predict: mode === "deep" ? 300 : 100,
    },
  });
  return res.message.content;
}

import ollama from "ollama";

export type Mode = "fast" | "deep";
export type Persona = "teacher" | "analyst" | "creative" | "concise";

export async function generateResponse(
  prompt: string,
  model: string,
  mode: Mode,
  persona: Persona,
) {
  const instructions = {
    teacher: "Explain everything simply and logically.",
    analyst: "Deconstruct the input and look for data points.",
    creative: "Focus on vivid imagery and unique metaphors.",
    concise: "Answer as briefly as possible with zero fluff.",
  };

  const depth = mode === "deep" ? "Focus on deep, chain-of-thought reasoning before concluding. Show your work." : "Think rapidly and skip internal reasoning.";

  const fullPrompt = `Persona: ${instructions[persona]}\nReasoning level: ${depth}\n\nTask: ${prompt}`;

  const res = await ollama.chat({
    model: model === "llama3.1" ? "llama3.1" : model === "llama3.2" ? "llama3.2" : "qwen2.5",
    messages: [
      {
        role: "user",
        content: fullPrompt,
      },
    ],
    options: {
      temperature: 0.7,
      num_predict: mode==="deep" ? 300 : 100
    },
  });
  return res.message.content;
}


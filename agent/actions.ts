export type Action = {
  model: "llama3.1" | "llama3.2" | "qwen2.5";
  persona: "teacher" | "analyst" | "creative" | "concise";
  mode: "fast" | "deep";
};

const models: Action["model"][] = ["llama3.1", "llama3.2", "qwen2.5"];
const personas: Action["persona"][] = ["teacher", "analyst", "creative", "concise"];
const modes: Action["mode"][] = ["fast", "deep"];

export const actions: Action[] = [];

for (const model of models) {
  for (const persona of personas) {
    for (const mode of modes) {
      actions.push({ model, persona, mode });
    }
  }
}


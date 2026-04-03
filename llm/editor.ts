import ollama from "ollama";

export async function improvePrompt(task: string, currentPrompt: string) {
  const prompt = `
    You are a prompt optimization agent.

    Task: ${task}
    Current Prompt: ${currentPrompt}

    Improve the prompt to: 
    - increase clarity
    - improve structure
    - match the task better
    - keep it concise

    Do NOT change the task meaning.
    
    Return ONLY the improved prompt.
    `;
  const res = await ollama.chat({
    model: "llama3.1",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return res.message.content.trim();
}

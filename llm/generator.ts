import ollama from "ollama";
export async function generateResponse(prompt: string) {
  const res = await ollama.chat({
    model: "llama3.1",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    options: {
      temperature: 0.7,
    },
  });
  return res.message.content;
}

import ollama from "ollama";

export async function judgeResponse(task: string, response: string) {
  const prompt = `
    Evaluate the response strictly.
    Task: ${task}
    Response: ${response}

    Return ONLY valid JSON. No extra text: 
    {
        "score": number(1-10),
        "rationale": "1-2 sentences"
    }
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
  const text = res.message.content || "{}";

  try {
    return JSON.parse(text);
  } catch (e) {
    console.log("JSON parse failed, raw: ", text);
    return {
      score: 0,
      rationale: "Parsing failed",
    };
  }
}

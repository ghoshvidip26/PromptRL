import { Ollama } from "ollama";

const ollama = new Ollama({
  host: "http://host.docker.internal:11434",
});

export async function judgeResponse(task: string, response: string) {
  const prompt = `
You are a strict evaluator grading one response for one task.

Task:
${task}

Response:
${response}

Score using this rubric:
- 10: Exceptional and fully aligned with the task. Precise, polished, and clearly better than a typical answer.
- 8: Good and correct, but ordinary. Meets the task with minor weaknesses or little originality.
- 6: Acceptable, but has noticeable issues in clarity, specificity, tone, or formatting.
- 4: Partially satisfies the task, but misses important constraints or quality expectations.
- 2: Poor response. Barely useful, confusing, or mostly off-task.
- 1: Fails the task entirely.

Evaluate these criteria:
- Task completion
- Constraint following
- Clarity
- Specificity
- Style fit for the requested format

Scoring rules:
- Use the full 1-10 scale.
- Do not default to 8 for merely acceptable responses.
- If the response is generic, repetitive, or interchangeable with many other answers, cap it at 7.
- If it violates an explicit constraint, cap it at 5.
- Give 9-10 only when the response is unusually strong.

Return ONLY valid JSON. No markdown, no extra text:
{
  "score": number,
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
    options: {
      temperature: 0,
    },
  });
  const text = res.message.content || "{}";

  try {
    const parsed = JSON.parse(text);
    const numericScore = Number(parsed.score);

    return {
      score: Number.isFinite(numericScore)
        ? Math.min(10, Math.max(1, Math.round(numericScore)))
        : 0,
      rationale:
        typeof parsed.rationale === "string"
          ? parsed.rationale
          : "Judge did not provide a rationale",
    };
  } catch (e) {
    console.log("JSON parse failed, raw: ", text);
    return {
      score: 0,
      rationale: "Parsing failed",
    };
  }
}

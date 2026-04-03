import { generateResponse } from "../llm/generator.js";
import { judgeResponse } from "../llm/judge.js";
import { improvePrompt } from "../llm/editor.js";

export async function runEpisode(task: string) {
  let prompt = task;
  let bestPrompt = prompt;
  let bestScore = 0;
  let prevScore = 0;

  console.log("Starting Episode");
  console.log("Task: ", task);

  for (let step = 0; step < 5; step++) {
    console.log(`\n--- Step ${step} ---`);
    console.log("Current prompt: ", prompt);

    // 1. Generate Output
    const output = await generateResponse(prompt);
    console.log("\n Generated Output: ");
    console.log(output.slice(0, 200), "...");

    // 2. Judge Evaluation
    const result = await judgeResponse(task, output);
    const score = result.score || 0;
    const rationale = result.rationale || "No rationale";

    console.log("Judge Score: ", score);
    console.log("Rationale: ", rationale);

    // 3. Reward
    const reward = score - prevScore;
    console.log("Reward: ", reward);

    // 4. Track best prompt
    if (score > bestScore) {
      bestScore = score;
      bestPrompt = prompt;
    }

    // 5. Improve prompt
    const newPrompt = await improvePrompt(task, prompt);
    console.log("\n Improved prompt: ");
    console.log(newPrompt);

    // 6. Accept / Reject logic
    if (score >= prevScore) {
      prompt = newPrompt;
      prevScore = score;
      console.log("Accepted improvement");
    } else {
      console.log("Rejected (no improvement)");
    }
  }
  console.log("\n🏆 FINAL RESULT");
  console.log("========================");
  console.log("Best Score:", bestScore);
  console.log("Best Prompt:", bestPrompt);
  return { bestPrompt, bestScore };
}

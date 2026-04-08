import { generateResponse } from "../llm/generator.js";
import { judgeResponse } from "../llm/judge.js";
import { chooseAction, updateQ } from "../agent/policy.js";
import { computeReward } from "../env/reward.js";

export async function runEpisode(
  task: string,
  taskLevel: string,
  episodes = 5,
  verbose = true,
) {
  console.log(`\n🚀 Starting Training Episode for [${taskLevel}]: ${task}`);

  let bestScore = 0;
  let bestConfig: any = null;
  let prevScore = 0;

  for (let i = 0; i < episodes; i++) {
    const action = chooseAction(taskLevel);
    const { model, mode, persona } = action;

    if (verbose) {
      console.log(`\n--- Trial ${i + 1} ---`);
      console.log(
        `Config: Model=[${model}] | Mode=[${mode}] | Persona=[${persona}]`,
      );
    }

    // 1. Generate Output
    const output = await generateResponse(task, model, mode, persona);

    // 2. Evaluate Quality
    const result = await judgeResponse(task, output);
    const score = result.score || 0;
    if (i === 0 || score > bestScore) {
      console.log("Sample Output:", output.slice(0, 150));
    }

    // 3. Reward (incorporates cost internally)
    const reward = computeReward(score, prevScore, action);
    console.log("PrevScore:", prevScore, "→ Current:", score);
    prevScore = score;
    updateQ(taskLevel, action, reward);

    console.log(`Result: Quality Score=${score} | Reward=${reward.toFixed(2)}`);

    if (score > bestScore) {
      bestScore = score;
      bestConfig = action;
    }
  }

  console.log(
    `\n[${taskLevel}] BEST CONFIG DISCOVERED:`,
    JSON.stringify(bestConfig, null, 2),
  );
  return { bestConfig, bestScore };
}

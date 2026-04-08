import { generateResponse } from "../llm/generator.js";
import { judgeResponse } from "../llm/judge.js";
import { computeReward } from "./reward.js";
import { type Action } from "../agent/actions.js";

type State = {
  task: string;
  prevScore: number;
  step: number;
};

let state: State;
const MAX_STEPS = 8;

export function reset(task: string) {
  state = {
    task,
    prevScore: 0,
    step: 0,
  };
  return state;
}

export async function step(action: any) {
  const { mode, persona, model } = action;

  // 1. Generate Output
  console.log("➡️ Calling generateResponse...");
  const output = await generateResponse(state.task, model, mode, persona);
  console.log("✅ generateResponse done");

  // 2. Judge Score
  console.log("➡️ Calling judgeResponse...");
  const result = await judgeResponse(state.task, output);
  const score = result.score || 0;

  // 3. Compute reward
  console.log("✅ judgeResponse done. Score:", score);

  // 4. Update state
  const reward = computeReward(score, state.prevScore, action);
  state.prevScore = score;
  state.step += 1;

  // 5. Done condition
  const done = state.step >= MAX_STEPS;

  return {
    state,
    reward,
    done,
    info: {
      score,
      output,
    },
  };
}

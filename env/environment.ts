import { generateResponse } from "../llm/generator.js";
import { judgeResponse } from "../llm/judge.js";
import { computeReward } from "./reward.js";

let state: any;

export function reset(task: string) {
  state = {
    task,
    prompt: task,
    prevScore: 0,
  };
  return state;
}

export async function step(action: any) {
  const { mode, persona, model } = action;

  console.log("➡️ Calling generateResponse...");
  const output = await generateResponse(state.task, model, mode, persona);
  console.log("✅ generateResponse done");

  console.log("➡️ Calling judgeResponse...");
  const { score } = await judgeResponse(state.task, output);

  console.log("✅ judgeResponse done. Score:", score);

  const reward = computeReward(score, state.prevScore, action);
  state.prevScore = score;

  return {
    state,
    reward,
    done: false,
  };
}
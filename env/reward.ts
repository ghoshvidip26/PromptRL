import { type Action } from "../agent/actions.js";

export function computeReward(score: number,prevScore: number, action: Action) {
  const modelCost = {
    "llama3.1": 10,
    "llama3.2": 3,
    "qwen2.5": 2
  };

  const baseCost = modelCost[action.model] || 5;
  const totalCost = action.mode === "deep" ? baseCost * 2 : baseCost;

const normalizedScore = score/10;

  const scoreGain = (score - prevScore)/10;
  const normalizedCost = totalCost/20;
  const alpha = 0.2;
  const reward = Math.max(0,normalizedScore + scoreGain - alpha * normalizedCost);

  return reward;
}


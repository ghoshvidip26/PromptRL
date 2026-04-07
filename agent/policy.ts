import { Q } from "./qTable.js";
import { actions, type Action } from "./actions.js";

const epsilon = 0.6;
const alpha = 0.15;

function getQKey(state: string, action: Action) {
  return `${state}:${JSON.stringify(action)}`;
}

export function chooseAction(state: string): Action {
  if (Math.random() < epsilon) {
    console.log("🟡 Exploring...")
    return actions[Math.floor(Math.random() * actions.length)]!;
  }
  else{
    console.log("🟢 Exploiting best action...")
  }

  let bestAction = actions[0]!;
  let bestValue = -Infinity;

  for (const action of actions) {
    const key = getQKey(state, action);
    const value = Q[key] || 0;

    if (value > bestValue || (value == bestValue && Math.random() < 0.3)) {
      bestValue = value;
      bestAction = action;
    }
  }
  return bestAction;
}

export function updateQ(state: string, action: Action, reward: number) {
  const key = getQKey(state, action);
  const oldValue = Q[key] || 0;
  Q[key] = oldValue + alpha * (reward - oldValue);
  console.log(`Updated Q[${key}] = ${Q[key].toFixed(2)}`)
}


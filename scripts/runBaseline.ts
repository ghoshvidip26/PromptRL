import { tasks } from "../env/tasks.js";
import { reset, step } from "../env/environment.js";
import { chooseAction, updateQ } from "../agent/policy.js";

async function run() {
  for (const task of tasks) {
    console.log(`\n🚀 Running Task: ${task.level}`);
    reset(task.task);

    let done = false;
    while (!done) {
      const action = chooseAction(task.level);
      const result = await step(action);
      updateQ(task.level, action, result.reward);
      console.log("Reward: ", result.reward.toFixed(2));
      done = result.done;
    }
  }
}

run();

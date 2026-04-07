import { tasks } from "../env/tasks.js";
import { runEpisode } from "../loop/runEpisode.js";

async function run() {
  for (const task of tasks) {
    console.log(`Running baseline for ${task.level}...`);
    const result = await runEpisode(task.task,task.level,6);
    console.log("\n RESULT: ",result);  
  }
}

run();
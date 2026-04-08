import { runEpisode } from "../loop/runEpisode.js";
import { tasks } from "../env/tasks.js";
async function run() {
  console.log("\n📊 FINAL RL SUMMARY");
  console.log("==================================================");

  for (const task of tasks) {
    const { bestConfig, bestScore } = await runEpisode(
      task.task,
      task.level,
      10,
      true,
    );

    console.log(
      `[${task.level}] Best Model: ${bestConfig.model} | Mode: ${bestConfig.mode} | Persona: ${bestConfig.persona} (Score: ${bestScore})`,
    );
  }
  console.log("\n✅ Suite finished.");
}
run();

import "dotenv/config";
import { runEpisode } from "./loop/runEpisode.js";
import { tasks } from "./env/tasks.js";

async function main() {
  console.log("🔥 Starting PromptRL Training Suite");
  console.log("Goal: Discover configurations that maximize Quality/Cost");

  const results = [];

  for (const taskObj of tasks) {
    // Run training for each task level
    const result = await runEpisode(taskObj.task, taskObj.level, 10);
    results.push({
      level: taskObj.level,
      task: taskObj.task,
      ...result
    });
  }

  console.log("\n\n📊 FINAL RL SUMMARY");
  console.log("==================================================");
  results.forEach(r => {
    console.log(`[${r.level}] Best Model: ${r.bestConfig.model} | Mode: ${r.bestConfig.mode} | Persona: ${r.bestConfig.persona} (Score: ${r.bestScore})`);
  });
}

main()
  .then(() => {
    console.log("\n✅ Suite finished.");
  })
  .catch((e) => {
    console.error("❌ Fatal Error:", e);
  });


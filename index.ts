import "dotenv/config";
import { runEpisode } from "./loop/runEpisode.js";

async function main() {
  const task = "Write a viral LinkedIn post about AI";
  const result = await runEpisode(task);

  console.log("\n🎉 DONE");
  console.log(result);
}
main()
  .then((r) => {
    console.log("Response: ", r);
  })
  .catch((e) => {
    console.log(e);
  });

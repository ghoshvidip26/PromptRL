# PromptRL

PromptRL is a small TypeScript reinforcement learning project for learning cost-aware LLM configurations. It treats prompt strategy selection as a Q-learning problem and searches for the best combination of model, reasoning mode, and persona for different task difficulty levels.

Instead of sending every task through the same model and prompt style, PromptRL explores a discrete action space and optimizes for output quality relative to inference cost.

## What It Does

For each task level (`easy`, `medium`, `hard`), the agent chooses an action made up of:

- `model`: `llama3.1`, `llama3.2`, `qwen2.5`
- `mode`: `fast`, `deep`
- `persona`: `teacher`, `analyst`, `creative`, `concise`

That action is used to generate an answer with Ollama. A judge model then scores the answer, and the environment computes a reward that favors strong outputs while penalizing more expensive configurations.

## RL Formulation

| Component | In This Project |
| --- | --- |
| State | Task level plus episode context such as previous score |
| Action | `model + mode + persona` |
| Reward | Normalized quality + score improvement - cost penalty |
| Policy | Epsilon-greedy Q-learning |
| Objective | Maximize quality while reducing unnecessary cost |

Reward is computed in [`env/reward.ts`](/Users/vidipghosh/Desktop/development/MetaHackathon/env/reward.ts), where larger models and `deep` mode carry a higher cost.

## How The Pipeline Works

```text
Task -> Policy selects action
     -> Generator calls Ollama
     -> Judge scores output
     -> Reward is computed
     -> Q-table is updated
```

Core flow:

- [`agent/actions.ts`](/Users/vidipghosh/Desktop/development/MetaHackathon/agent/actions.ts) defines the full action space.
- [`agent/policy.ts`](/Users/vidipghosh/Desktop/development/MetaHackathon/agent/policy.ts) chooses actions and updates Q-values.
- [`llm/generator.ts`](/Users/vidipghosh/Desktop/development/MetaHackathon/llm/generator.ts) generates responses with the chosen configuration.
- [`llm/judge.ts`](/Users/vidipghosh/Desktop/development/MetaHackathon/llm/judge.ts) evaluates the generated response and returns a JSON score.
- [`loop/runEpisode.ts`](/Users/vidipghosh/Desktop/development/MetaHackathon/loop/runEpisode.ts) runs the training loop for each task.

## Tasks Included

The environment currently trains on three prompt types from [`env/tasks.ts`](/Users/vidipghosh/Desktop/development/MetaHackathon/env/tasks.ts):

- `easy`: short tweet generation
- `medium`: constrained LinkedIn post generation
- `hard`: beginner-friendly explanation of quantum computing

These tasks intentionally vary in complexity so the learned policy can discover when a cheaper configuration is sufficient and when extra reasoning is worth the cost.

## Project Structure

```text
.
├── agent/         Q-table, action space, exploration/exploitation policy
├── env/           tasks, reward logic, environment step/reset
├── llm/           generation and judging through Ollama
├── loop/          episode runner
├── scripts/       runnable entrypoints
├── index.ts       main training suite
└── openenv.yaml   compact environment spec
```

## Requirements

- Node.js 20+
- npm
- Ollama running locally with the required models available

This project calls Ollama at `http://host.docker.internal:11434` in both [`llm/generator.ts`](/Users/vidipghosh/Desktop/development/MetaHackathon/llm/generator.ts) and [`llm/judge.ts`](/Users/vidipghosh/Desktop/development/MetaHackathon/llm/judge.ts). If you are running outside Docker and that hostname does not resolve on your machine, update the host value to match your local Ollama setup.

Required models:

- `llama3.1`
- `llama3.2`
- `qwen2.5`

Example:

```bash
ollama pull llama3.1
ollama pull llama3.2
ollama pull qwen2.5
ollama serve
```

## Installation

```bash
npm install
```

## Running The Project

Run the main training suite:

```bash
./scripts/run.sh
```

Or run the TypeScript entrypoint directly:

```bash
npx tsx index.ts
```

Run the simpler baseline loop:

```bash
npx tsx scripts/runBaseline.ts
```

Run the final summary script:

```bash
npx tsx scripts/runFinal.ts
```

## Example Output

```text
FINAL RL SUMMARY

[easy] Best Model: llama3.2 | Mode: fast | Persona: teacher
[medium] Best Model: llama3.2 | Mode: deep | Persona: analyst
[hard] Best Model: llama3.2 | Mode: fast | Persona: concise
```

Actual results will vary because the policy uses exploration and the judge score depends on live model output.

## Docker

Build:

```bash
docker build -t promptrl .
```

Run:

```bash
docker run --rm promptrl
```

The container starts [`scripts/runFinal.ts`](/Users/vidipghosh/Desktop/development/MetaHackathon/scripts/runFinal.ts). Since the code expects Ollama at `host.docker.internal:11434`, Docker usage assumes Ollama is running on the host machine and reachable from the container.

## Notes And Limitations

- The Q-table is in-memory and does not persist across runs.
- Reward weights are hand-tuned in [`env/reward.ts`](/Users/vidipghosh/Desktop/development/MetaHackathon/env/reward.ts).
- Quality evaluation depends on a judge model rather than human labels.
- The action and task spaces are intentionally small for fast experimentation.

## Why This Project Matters

PromptRL is a compact demonstration of a practical idea: not every task deserves the same LLM configuration. By framing prompt and model selection as reinforcement learning, the system can learn when to spend more for better reasoning and when to stay cheap without sacrificing useful quality.

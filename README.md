# PromptRL 🧠💰

"We train an RL agent to discover the cheapest LLM configuration that still achieves the best output — because overthinking is expensive."

## How it Works
The system uses **Q-Learning** to map different levels of task difficulty (Easy, Medium, Hard) to the most cost-effective LLM configuration.

### Dimensions of Configuration (Actions):
1.  **Model**: `llama3.1` (Expensive), `llama3.2` (Balanced), `qwen2.5` (Cheap).
2.  **Persona**: `Teacher`, `Analyst`, `Creative`, `Concise`.
3.  **Mode**: `Fast` (direct) vs `Deep` (+Chain of Thought).

### Reward Function
The reward is calculated as:
`Reward = QualityScore - (Alpha * TotalCost)`
- **QualityScore**: Judged by a gold-standard model (llama3.1).
- **Cost**: Estimated based on model size and reasoning depth.

Over time, for "Easy" tasks, the agent learns to favor cheaper models like `qwen2.5` in `Fast` mode, as they provide high enough quality for much lower cost. For "Hard" tasks, it may discover that only `llama3.1` in `Deep` mode provides a high enough score to justify its high cost.

## Getting Started
1.  Ensure you have [Ollama](https://ollama.com/) running.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the training suite:
    ```bash
    ./scripts/run.sh
    ```

## Project Structure
- `agent/`: Q-Table logic and action space.
- `env/`: Reward function and task registry.
- `llm/`: Drivers for Generator and Judge (using Ollama).
- `loop/`: Training episodes.

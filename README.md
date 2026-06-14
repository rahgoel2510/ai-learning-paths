# AI Learning Paths

Interactive hands-on learning app with real cloud validation checkpoints. Build production-grade data pipelines on AWS & Azure with step-by-step guided labs.

## Learning Paths

| Path | Status |
|------|--------|
| Hyperscaler Data Pipelines | ✅ Active |
| Advanced RAG Pipelines | 🔜 Coming Soon |
| Exact Search & Hybrid Search | 🔜 Coming Soon |
| Agentic RAG | 🔜 Coming Soon |
| AWS Bedrock Agentic Low-Code | 🔜 Coming Soon |
| Hide & Hype Approach | 🔜 Coming Soon |
| Chunking Strategies | 🔜 Coming Soon |
| Document Extraction Patterns | 🔜 Coming Soon |

## Features

- **Step-by-step guided labs** with detailed OS-specific instructions (Mac/Windows/Linux)
- **Real validation** — uses `aws` and `az` CLI to verify each step is done
- **Auth status** — green/red dot showing your cloud account connection + account name
- **Persistent progress** — state saved to file, survives browser refresh and restarts
- **Provider selection** — choose AWS or Azure path
- **Budget protection** — setup includes budget alerts before any resource creation

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Framer Motion
- CLI validation via `child_process` (no SDK dependencies)

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Prerequisites

- **For AWS path**: Install [AWS CLI](https://aws.amazon.com/cli/) and run `aws configure`
- **For Azure path**: Install [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) and run `az login`

## Reset Progress

```bash
rm data/state.json
```

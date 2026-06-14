export type LearningPath = {
  id: string;
  title: string;
  description: string;
  icon: string;
  available: boolean;
};

export const LEARNING_PATHS: LearningPath[] = [
  { id: 'hyperscaler-pipelines', title: 'Hyperscaler Data Pipelines', description: 'Build production-grade streaming pipelines on AWS & Azure', icon: '🚀', available: true },
  { id: 'advanced-rag', title: 'Advanced RAG Pipelines', description: 'Retrieval-augmented generation with reranking, routing & evaluation', icon: '🧠', available: false },
  { id: 'search-hybrid', title: 'Exact Search & Hybrid Search', description: 'Vector, keyword, and hybrid search patterns with scoring', icon: '🔍', available: false },
  { id: 'agentic-rag', title: 'Agentic RAG', description: 'Autonomous agents with tool-use, planning & retrieval loops', icon: '🤖', available: false },
  { id: 'bedrock-agentic', title: 'AWS Bedrock Agentic Low-Code', description: 'Build agentic systems with Bedrock Agents & Knowledge Bases', icon: '⚡', available: false },
  { id: 'hide-n-hype', title: 'Hide & Hype Approach', description: 'Strategic information retrieval with context hiding & emphasis', icon: '🎭', available: false },
  { id: 'chunking', title: 'Chunking Strategies', description: 'Semantic, recursive, agentic & document-aware chunking', icon: '✂️', available: false },
  { id: 'doc-extraction', title: 'Document Extraction Patterns', description: 'PDF, table, image & multi-modal document parsing pipelines', icon: '📄', available: false },
];

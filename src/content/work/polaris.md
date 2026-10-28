---
title: Polaris
order: 2
kind: featured
blurb: "Study-abroad planner for Bangladeshi students, with an AI agent that reads your roadmap before it answers."
when: May – Sep 2026
year: "2026"
team: Team of 5
status: finalist
award: Finalist, Infinity AI BuildFest 2026
links:
  - label: Live demo
    href: https://polaris-ai-academy.vercel.app
  - label: GitHub
    href: https://github.com/DesignNovae/Polaris
shots:
  - src: /work/polaris.webp
    label: Landing
    alt: "The Polaris landing page with a roadmap preview."
tag: "Next.js · team of 5"
stack: ["Next.js 15", "TypeScript", "MongoDB", "Gemma 4", "Zod"]
---

## Problem

A student in Bangladesh planning to study abroad has to track deadlines, test scores, documents and admission odds on their own. Polaris turns that into one roadmap, with an AI assistant that answers in Bengali or English.

## How the assistant answers

Gemma 4 calls typed server-side tools before it replies. It searches the knowledge base, reads the student's milestones and works out their admission odds, so a question about deadlines gets answered from that student's own roadmap.

Follow-up questions get rewritten with the chat history first, which means "what about the deadline?" searches for the university you were just discussing. Each student also has long-term memory the assistant can read back.

## How retrieval works

Two searches run in parallel, one over the shared knowledge base and one over the student's own memory. BM25 catches exact names like a university or a test, and embeddings catch the same question asked in other words.

Reciprocal Rank Fusion merges the two lists. Plain fusion kept ranking weak keyword hits first, so the embedding list counts 1.6 times. On a 50-question test set, the right passage came back in the top three 98% of the time.

<details>
<summary>The rank fusion</summary>

```ts
// lib/rag/search.ts
function fuse(lists: RankList[]): Map<string, number> {
  const fused = new Map<string, number>();
  for (const { hits, weight } of lists) {
    hits.forEach((hit, rank) => {
      fused.set(
        hit.chunkId,
        (fused.get(hit.chunkId) ?? 0) + weight / (RRF_K + rank + 1),
      );
    });
  }
  return fused;
}
```

</details>

## Practice questions

The exam lab writes IELTS and SAT practice sets. Gemma 4 plans each set, then writes it in batches. Workers claim each batch atomically in MongoDB, stop after a capped number of retries and throw out duplicate questions, so two workers never write the same batch.

## Recognition

Finalist at Infinity AI BuildFest 2026, a national AI hackathon with over 3,500 registrants, and Special Recognition in the Build with Gemma AI Innovation Challenge 2026.

---
title: SortWise
order: 1
kind: featured
blurb: "Saves every X bookmark the moment you tap it, then sorts it with AI on your own PC."
when: Sep 2026 – now
year: "2026"
team: Solo
status: shipped
links:
  - label: Live demo
    href: https://try-sortwise.vercel.app/demo/
  - label: Website
    href: https://try-sortwise.vercel.app
  - label: GitHub
    href: https://github.com/sayem-112/SortWise
shots:
  - src: /work/sortwise-home.webp
    label: Website
    alt: "The SortWise website: Save it on X. Find it in seconds."
  - src: /work/sortwise-app.webp
    label: Overview
    alt: "The SortWise demo overview: 83 bookmarks organised into categories and tags."
  - src: /work/sortwise.webp
    label: A saved post
    alt: "A saved post open in SortWise with its AI summary, category and tags."
cover: /work/sortwise-cover.webp
tag: "Go · solo"
stack: ["Go", "SQLite (FTS5)", "React", "TypeScript", "Manifest V3", "Gemini", "Groq"]
---

## Problem

X keeps your bookmarks in one long list with no folders and a search that misses most of what you saved. You bookmark a post in March and can't find it in June.

## How it works

A Manifest V3 extension watches X. Tap bookmark and it sends the post to a Go server running on your PC, which stores it in SQLite within a second.

Background workers send each new post to Gemini for a summary, tags and a category. The job queue lives in SQLite too, so work survives a crash or a restart. When Gemini's free daily limit runs out, the worker rests that provider and hands the next post to Groq.

<details>
<summary>How the worker picks a provider</summary>

```go
// internal/ai/worker.go
func (w *Worker) choose(ctx context.Context, config Configuration) providerChoice {
	now := time.Now().UnixNano()
	choice := providerChoice{unconfigured: true}
	for _, name := range w.candidates(config) {
		key, _, err := w.credentials.Get(name)
		if err != nil || key == "" || w.factories[name] == nil {
			continue
		}
		choice.unconfigured = false
		if now < w.cooldown(name).Load() {
			choice.resting = true
			continue
		}
		return providerChoice{name: name, key: key}
	}
	return choice
}
```

</details>

## Key features

- Search by exact words with SQLite FTS5, or by meaning with embeddings.
- Smart collections: save a search to the sidebar and new matching posts land in it.
- Your library is one file on your PC. No account, no cloud database, and export to JSON or CSV.
- The extension pairs with a one-time code, and API keys sit in Windows Credential Manager.
- One Windows executable with the React app built in.

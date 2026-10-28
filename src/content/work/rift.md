---
title: Rift
order: 1.5
kind: featured
blurb: "Start a book on your phone, finish it on your laptop, on the same page."
when: Oct 2026 – now
year: "2026"
team: Solo
status: building
shots:
  - src: /work/rift-home.webp
    label: Landing
    alt: "The Rift landing page: Your books. Every device. Exactly where you left off."
  - src: /work/rift-handoff.webp
    label: Handoff
    alt: "A phone open at Meditations in front of a laptop showing the same library of illustrated covers."
  - src: /work/rift-library.webp
    label: Library
    alt: "The Rift library: a Continue reading card at 62% from the phone, above a grid of covers."
  - src: /work/rift-settings.webp
    label: Settings
    alt: "Rift settings: account, accent colours, storage and devices."
cover: /work/rift-cover.webp
tag: "Go · Postgres · solo"
stack: ["Go", "Postgres", "sqlc", "Cloudflare R2", "React", "Vite"]
---

## Problem

You read on your phone on the bus and on your laptop at home, and each device remembers a different page. Rift keeps your PDFs and EPUBs, and your place in them, the same on every device.

## How sync works

The server gives every change to your library a version number. A device asks for everything since the last version it saw, and the change feed keeps one row per book, so a phone that sat offline for a week catches up in one request.

When a change commits, Postgres fires `NOTIFY`. Each server holds one `LISTEN` connection and pings its open Server-Sent Events streams, then the client fetches the change itself. A missed ping costs nothing.

Phone clocks drift. The server corrects each reading position by the gap between the device's clock and its own, and the later position wins. Rift keeps the losing one so you can jump back.

## Uploads and security

- Books go from the browser straight to Cloudflare R2 in 8 MiB parts, encrypted in the browser, on presigned URLs that fix each part's size. A dropped upload resumes where it stopped.
- Envelope encryption: a master key wraps a key per user, which wraps a key per book.
- No passwords. You sign in with an email link or Google, refresh tokens rotate on every use, and reusing an old one ends the session.

## Background jobs

Cleanup work (expired sessions, abandoned uploads, emptying the trash after 30 days) runs on a job queue inside Postgres. If a worker crashes, its lease runs out and another worker takes the job.

<details>
<summary>How workers claim jobs</summary>

```sql
-- internal/database/queries/jobs.sql
UPDATE jobs
SET state = 'running',
    attempts = attempts + 1,
    locked_until = now() + make_interval(secs => sqlc.arg(lease_seconds)::int)
WHERE id IN (
    SELECT id FROM jobs
    WHERE (state = 'pending' AND run_at <= now())
       OR (state = 'running' AND locked_until < now())
    ORDER BY run_at
    LIMIT sqlc.arg(batch_size)::int
    FOR UPDATE SKIP LOCKED
)
RETURNING *;
```

</details>

## Status

The backend works end to end, with integration tests against real Postgres and S3. The web app runs on a sample library until it connects to the API.

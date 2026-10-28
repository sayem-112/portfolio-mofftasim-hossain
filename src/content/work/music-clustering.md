---
title: Multi-Modal Music Clustering
order: 9
kind: research
blurb: "Groups 450 Bangla and English songs by how they sound and what they say."
when: Dec 2025 – Jan 2026
year: "2026"
course: CSE425
status: coursework
links:
  - label: GitHub
    href: https://github.com/sayem-112/hybrid-lang-music-clustering
stack: ["Python", "PyTorch", "librosa"]
---

## Problem

Group 450 Bangla and English songs by how they sound and what the lyrics say, with no genre labels to learn from.

## Approach

I fed audio features from librosa and lyric features into VAE and Beta-VAE models, which learn one shared space for both. I clustered the songs in that space and benchmarked the result against K-Means and spectral clustering.

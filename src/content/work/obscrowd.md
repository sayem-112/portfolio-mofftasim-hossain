---
title: Multi-Portrait Biometric Unlinkability Under Generative Editing
order: 5
kind: research
blurb: "Protects every face in a group photo from being matched back to the person after AI editing."
when: Oct 2025 – Jun 2026
year: "2026"
team: Thesis team of 4
status: thesis
stack: ["PyTorch", "Diffusers", "Stable Diffusion 1.5"]
---

## Problem

Diffusion editors like SDEdit and InstructPix2Pix can restyle a group photo, and face recognition can still match each face back to the person.

## Approach

Our method adds a small protective perturbation to every face in a photo, so ArcFace and FaceNet fail to match them after someone edits the image. We built it on Stable Diffusion 1.5 with PyTorch and Diffusers, then edited protected photos with SDEdit and InstructPix2Pix to test it.

## Status

Our undergraduate thesis, graded A+. We're preparing the paper, so the results stay off this page for now.

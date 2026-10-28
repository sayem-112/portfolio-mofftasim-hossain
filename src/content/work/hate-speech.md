---
title: Hate Speech Detection
order: 11
kind: research
blurb: "SVM, LSTM and fine-tuned BERT on imbalanced hate-speech data. BERT won, at 90% accuracy."
when: Jan – May 2025
year: "2025"
course: CSE427
status: coursework
links:
  - label: GitHub
    href: https://github.com/sayem-112/hate-speech-detection
stack: ["Python", "scikit-learn", "BERT"]
---

## Problem

In Twitter data, hate speech is rare next to ordinary offensive language. A classifier can score high accuracy and still miss most of the hateful posts.

## Approach

I undersampled the majority class, then trained an SVM, an LSTM and a fine-tuned BERT model on the same split. BERT came out on top at 90% accuracy.

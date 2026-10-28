---
title: Systems Programming
order: 8
kind: coursework
blurb: "A Unix shell, an fsck for a VSFS disk image, and a compiler front end. All in C."
when: 2025 – 2026
year: "2026"
course: CSE321, CSE420
status: coursework
links:
  - label: Shell on GitHub
    href: https://github.com/sayem-112/custom-unix-shell
  - label: fsck on GitHub
    href: https://github.com/sayem-112/vsfs-fsck-file-checker
stack: ["C", "Linux", "Flex", "Bison"]
---

## Unix shell

Runs programs with `fork` and `exec`, and supports pipes, `<` `>` `>>` redirection, `&&` and `;` chaining, built-ins and history. Ctrl+C stops the running program and leaves the shell alone.

## fsck for VSFS

Checks a VSFS disk image and repairs the superblock, the inode and data bitmaps, and duplicate or bad blocks.

## Compiler front end

Flex and Bison parse the source language and emit three-address code.

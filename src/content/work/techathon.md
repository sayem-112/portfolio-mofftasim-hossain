---
title: WattsUp and Vantage Arm
order: 3
kind: featured
blurb: "A live office power dashboard, and a six-axis robotic arm you can drive in the browser."
when: Jul 2026
year: "2026"
team: Hackathon team
status: finalist
award: National Finalist, Techathon Nationals 2026
links:
  - label: Vantage Arm demo
    href: https://vantage-arm.netlify.app
shots:
  - src: /work/vantage.webp
    label: Vantage Arm
    alt: "The Vantage Arm digital twin: a six-axis arm in a 3D scene with joint controls."
tag: "Three.js · Socket.IO"
stack: ["React", "Express", "Socket.IO", "Three.js", "discord.js"]
---

## WattsUp

People in a small office leave lights and fans running. WattsUp shows every device in every room on a live isometric 3D office, and a Discord bot tells you what's on from anywhere.

One Express backend owns the device state. It pushes every change to the React dashboard over Socket.IO and serves the bot over REST, so the two can't disagree. An alert engine flags devices left on after hours and rooms that have been fully on for two hours, and the bot posts those alerts to a channel.

The device data is simulated, and an office clock you can speed up to 1800× lets you watch a whole day of alerts in a minute.

## Vantage Arm

A browser digital twin of a six-axis robotic arm, built in Three.js from the arm's URDF model. Place a target and inverse kinematics works out the joint angles while the arm steers around obstacles and safety zones. You can also drive it by voice.

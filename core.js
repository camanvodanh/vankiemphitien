"use strict";

const $ = id => document.getElementById(id);

const canvas = $("game");
const ctx = canvas.getContext("2d");
const cameraCanvas = $("leaderCanvas");
const cameraCtx = cameraCanvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

// Khu vực đua được đặt cao hơn.
// Phía dưới dành riêng cho quảng trường và khán đài.
const TRACK = {
  left: 100,
  right: 1000,
  top: 125,
  bottom: 475
};

const palette = [
  ["#d95c4b", "#853c35"],
  ["#4d8db2", "#315a7a"],
  ["#a78ac9", "#66517f"],
  ["#d4a64d", "#8c682e"],
  ["#5b9b76", "#376447"],
  ["#d17b9c", "#8e4c68"],
  ["#b8b9c6", "#747583"],
  ["#c77a45", "#804b2e"],
  ["#6c9eaa", "#426c75"],
  ["#b4a05d", "#76652f"]
];

const ROLE = {
  servant: {
    name: "Tạp dịch",
    robe: "#817b6a",
    dark: "#4f4b42",
    belt: "#a99b77",
    aura: null,
    scale: .72
  },

  outer: {
    name: "Ngoại môn",
    robe: "#4d83a1",
    dark: "#294f6c",
    belt: "#c3a86b",
    aura: null,
    scale: .8
  },

  inner: {
    name: "Nội môn",
    robe: "#d8dfd0",
    dark: "#719b9a",
    belt: "#d5b86e",
    aura: "#b5e5d8",
    scale: .88
  },

  core: {
    name: "Nòng cốt",
    robe: "#d6b45e",
    dark: "#89602e",
    belt: "#fff0b2",
    aura: "#ffe3a0",
    scale: .98
  },

  disciple: {
    name: "Thân truyền",
    robe: "#c9d7e8",
    dark: "#526d91",
    belt: "#f3d88b",
    aura: "#b9d8ff",
    scale: 1.08
  },

  elder: {
    name: "Trưởng lão",
    robe: "#755b91",
    dark: "#443451",
    belt: "#e5c67d",
    aura: "#d8c2ff",
    scale: 1.15
  },

  master: {
    name: "Môn chủ",
    robe: "#a83f36",
    dark: "#592b2b",
    belt: "#f6d88b",
    aura: "#ffe8a4",
    scale: 1.38
  }
};

let racers = [];
let particles = [];
let stars = [];
let clouds = [];
let waterLines = [];

let running = false;
let paused = false;
let started = false;
let finished = false;
let locked = false;

let duration = 60;
let distance = 10000;
let elapsed = 0;

let countdown = 0;
let countdownAccumulator = 0;

let eventClock = 0;
let nextEvent = 6;
let eventText = "";
let eventTextLife = 0;

let finishQueue = [];
let cameraFocusId = null;
let finishMessage = "";
let finishMessageLife = 0;

let lastTime = 0;
let sceneTime = 0;
let ceremonyStartedAt = 0;

const rand = (min, max) =>
  Math.random() * (max - min) + min;

const randInt = (min, max) =>
  Math.floor(rand(min, max + 1));

const clamp = (v, min, max) =>
  Math.max(min, Math.min(max, v));

function timeText(value) {
  const seconds = Math.max(0, Math.ceil(value));

  return (
    String(Math.floor(seconds / 60)).padStart(2, "0") +
    ":" +
    String(seconds % 60).padStart(2, "0")
  );
}

function laneGap() {
  return (TRACK.bottom - TRACK.top) /
    Math.max(1, racers.length);
}

function laneY(index) {
  return TRACK.top + laneGap() * index + laneGap() / 2;
}

function racerScale() {
  const gap = laneGap();
  const scaleByCount = 1.25 - racers.length * .008;
  const scaleByLane = gap * .78 / 51;

  return clamp(
    Math.min(1.05, scaleByCount, scaleByLane),
    .055,
    1.05
  );
}

function progressOf(racer) {
  return clamp(racer.progress / distance, 0, 1);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[ch]);
}
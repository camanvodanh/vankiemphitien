"use strict";

const $ = id => document.getElementById(id);

const canvas = $("game");
let ctx = canvas.getContext("2d");
const cameraCanvas = $("leaderCanvas");
const cameraCtx = cameraCanvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

// Khu vực đua được đặt cao hơn.
// Phía dưới dành riêng cho quảng trường và khán đài.
const TRACK = {
  left: 100,
  right: 1000,
  top: 115,
  bottom: 525
};

const palette = VKP_DATA.characters.racerPalette;
const ROLE = VKP_DATA.characters.roles;

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
  // Chừa khoảng trời phía dưới đường đua để phi kiếm luôn bay cao,
  // không hạ ngang tầm ngai và ghế của chưởng môn.
  const flightBottom = TRACK.bottom - 140;
  return Math.max(1, (flightBottom - TRACK.top) /
    Math.max(1, racers.length));
}

function laneY(index) {
  return TRACK.top + laneGap() * index + laneGap() / 2;
}

function racerScale() {
  // Tăng kích thước nhân vật để dễ quan sát; giữ cố định theo số lượng triệu hồi.
  // laneGap() chỉ thay đổi vị trí theo chiều dọc, không làm nhân vật tự thu nhỏ.
  return 0.92;
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
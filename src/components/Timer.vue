<template>
  <div class="time-container">
    <aside class="sidebar">
      <div class="logo">
        <img src="@/assets/logo-t.png" alt="IronScore Logo" />
      </div>
      <div class="user-info">
        <h4>Edit Account</h4>
        <p><strong>Name:</strong> Example</p>
        <p><strong>Surname:</strong> Example</p>
        <p><strong>Email:</strong> example@gmail.com</p>
        <p><strong>Age:</strong> 25</p>
        <p><strong>Account type:</strong> Regular</p>
      </div>
      <nav class="menu">
        <router-link to="/dashboard" class="menu-item">dashboard</router-link>
        <router-link to="/competitions" class="menu-item"
          >competitions</router-link
        >
        <router-link to="/community" class="menu-item">Community</router-link>
        <router-link to="/timer" class="menu-item active-item"
          >Timer</router-link
        >
        <router-link to="/trainings" class="menu-item">Trainings</router-link>
      </nav>
    </aside>

    <main class="timer-content">
      <header class="timer-header">
        <h2 class="title">timer</h2>
        <router-link to="/" class="btn btn-link text-warning fw-bold p-0"
          >Log Out</router-link
        >
      </header>
      <div class="set-time">
        <label>Set time:</label>
        <input type="number" v-model.number="inputMinutes" min="0" max="59" />
        <span>:</span>
        <input type="number" v-model.number="inputSeconds" min="0" max="59" />
        <button @click="setTime">Set</button>
      </div>

      <div id="display">{{ formattedTime }}</div>

      <div class="controls">
        <button @click="startTimer" :disabled="isRunning">Start</button>
        <button @click="resetTimer">Reset</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const inputMinutes = ref(0);
const inputSeconds = ref(30);
const totalSeconds = ref(30);
const timer = ref(null);
const isRunning = ref(false);

const formattedTime = computed(() => {
  const min = String(Math.floor(totalSeconds.value / 60)).padStart(2, "0");
  const sec = String(totalSeconds.value % 60).padStart(2, "0");
  return `${min}:${sec}`;
});

function setTime() {
  totalSeconds.value = inputMinutes.value * 60 + inputSeconds.value;
}

function startTimer() {
  if (isRunning.value || totalSeconds.value <= 0) return;
  isRunning.value = true;
  timer.value = setInterval(() => {
    if (totalSeconds.value > 0) {
      totalSeconds.value--;
    } else {
      clearInterval(timer.value);
      isRunning.value = false;
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer.value);
  isRunning.value = false;
  setTime();
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

body,
html {
  margin: 0;
  font-family: "Segoe UI", sans-serif;
}

.container {
  display: flex;
  height: 100vh;
  color: white;
  background: #000;
}

.sidebar {
  width: 250px;
  background: #111;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}

.logo img {
  width: 100%;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  color: #ffffff;
  font-weight: bold;
  text-decoration: none;
  font-size: 20px;
  text-transform: uppercase;
}
.active-item {
  color: #ffc107 !important;
}

.logout {
  position: absolute;
  top: 20px;
  right: 30px;
  color: #ffd700;
  font-size: 14px;
  cursor: pointer;
}

.set-time {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
}

.set-time input {
  width: 60px;
  padding: 5px;
  font-size: 18px;
  text-align: center;
  border-radius: 10px;
}

.set-time button {
  background-color: #ffc107;
  color: #000;
  border: none;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 10px;
}

#setTimeBtn:hover {
  background-color: #ffb300;
}

#display {
  font-size: 96px;
  text-align: center;
  margin: 40px 0;
  font-weight: bold;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.controls button {
  padding: 14px 28px;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  min-width: 120px;
}

.controls button:first-child {
  background-color: #ffc107;
  color: black;
}

.controls button:last-child {
  background-color: #d32f2f;
  color: white;
}

.timer-content {
  flex: 1;
  padding: 30px;
  background: #000;
  overflow-y: auto;

  height: 100vh;
}

.timer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: #ffc107;
  text-transform: uppercase;
  font-weight: 900;
}

.title {
  font-weight: bold;
}
.time-container {
  display: flex;
  height: 100vh;
  font-family: "Roboto", sans-serif;
  color: #fff;
  background: #000;
}
.user-info {
  border-top: 1px solid #333;
  padding-top: 10px;
}
</style>

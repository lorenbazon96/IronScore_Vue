<template>
  <div class="container-fluid">
    <div class="row min-vh-100">
      <aside class="col-12 col-md-3 sidebar bg-darka text-white p-3">
        <div class="logo mb-3">
          <img
            src="@/assets/logo-t.png"
            alt="IronScore Logo"
            class="img-fluid"
          />
        </div>
        <div class="user-info border-top pt-2 mb-3">
          <router-link to="/edit-account" class="edit d-block mb-2"
            >Edit Account</router-link
          >
          <p><strong>Name:</strong> {{ userStore.name }}</p>
          <p><strong>Surname:</strong> {{ userStore.surname }}</p>
          <p><strong>Email:</strong> {{ userStore.email }}</p>
          <p><strong>Age:</strong> {{ userStore.age }}</p>
        </div>
        <nav class="menu d-flex flex-column gap-2">
          <router-link to="/dashboard" class="menu-item">Dashboard</router-link>
          <router-link to="/competitions" class="menu-item"
            >Competitions</router-link
          >
          <router-link to="/community" class="menu-item">Community</router-link>
          <router-link to="/timer" class="menu-item active-item"
            >Timer</router-link
          >
          <router-link to="/trainings" class="menu-item">Trainings</router-link>
        </nav>
      </aside>

      <main class="col-12 col-md-9 timer-content p-4 bg-black text-white">
        <header
          class="timer-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4"
        >
          <h2 class="title text-warning fw-bold text-uppercase mb-2 mb-md-0">
            timer
          </h2>
          <router-link
            to="/"
            class="btn btn-link text-warning fw-bold p-0 logout-link"
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
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user";

export default {
  name: "Timer",
  data() {
    return {
      inputMinutes: 0,
      inputSeconds: 30,
      totalSeconds: 30,
      timer: null,
      isRunning: false,
    };
  },
  computed: {
    formattedTime() {
      const min = String(Math.floor(this.totalSeconds / 60)).padStart(2, "0");
      const sec = String(this.totalSeconds % 60).padStart(2, "0");
      return `${min}:${sec}`;
    },
    userStore() {
      return useUserStore();
    },
  },
  methods: {
    setTime() {
      const mins = Number(this.inputMinutes) || 0;
      const secs = Number(this.inputSeconds) || 0;
      this.totalSeconds = Math.max(0, mins * 60 + secs);
    },
    startTimer() {
      if (this.isRunning || this.totalSeconds <= 0) return;
      this.isRunning = true;
      this.timer = setInterval(() => {
        if (this.totalSeconds > 0) {
          this.totalSeconds--;
        } else {
          clearInterval(this.timer);
          this.timer = null;
          this.isRunning = false;
        }
      }, 1000);
    },
    resetTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.isRunning = false;
      this.setTime();
    },
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer);
  },
};
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

.logout-link {
  color: #ffc107 !important;
  font-size: 14px;
  text-transform: uppercase;
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

.edit {
  color: #ffc107;
}

.bg-darka {
  background-color: #000 !important;
}
</style>

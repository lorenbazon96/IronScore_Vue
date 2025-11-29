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

        <div class="user-info mb-3 border-top pt-2">
          <div
            class="user-info-inner d-flex justify-content-between align-items-center mt-2"
          >
            <div class="d-flex align-items-center">
              <img src="@/assets/user.png" alt="User" class="user-icon me-2" />
              <span class="fw-bold user-name">
                {{ userStore.name }} {{ userStore.surname }}
              </span>
            </div>

            <router-link
              to="/edit-r-account"
              class="settings-link d-flex align-items-center"
            >
              <img
                src="@/assets/setting1.png"
                alt="Settings"
                class="settings-icon"
              />
            </router-link>
          </div>
        </div>

        <nav class="menu d-flex flex-column gap-2">
          <router-link to="/dashboard" class="menu-item">Progress</router-link>
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

      <main class="col-12 col-md-9 timer-content bg-black text-white">
        <header
          class="timer-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4"
        >
          <h2 class="title text-warning fw-bold text-uppercase mb-2 mb-md-0">
            timer
          </h2>
          <router-link
            to="/"
            class="btn btn-link text-warning fw-bold p-0 logout-link d-flex align-items-center"
          >
            <img
              src="@/assets/logout.png"
              alt="Logout"
              class="logout-icon me-2"
            />
            Log Out
          </router-link>
        </header>

        <div class="timer-wrapper" :class="{ 'timer-running': isRunning }">
          <div class="set-time">
            <label class="set-time-label">Set time:</label>
            <input
              type="number"
              v-model.number="inputMinutes"
              min="0"
              max="59"
            />
            <span class="set-time-separator">:</span>
            <input
              type="number"
              v-model.number="inputSeconds"
              min="0"
              max="59"
            />
            <button @click="setTime">Set</button>
          </div>

          <div id="display">{{ formattedTime }}</div>

          <div class="controls">
            <button
              @click="startTimer"
              :disabled="isRunning || totalSeconds <= 0"
            >
              Start
            </button>
            <button @click="resetTimer">Reset</button>
          </div>
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
      if (this.totalSeconds === 0) {
        this.isRunning = false;
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }
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
.logo img {
  width: 100%;
}

.bg-darka {
  background-color: #000 !important;
}

.user-info {
  border-top: 1px solid #333;
  padding: 10px 15px 0 15px;
}

.user-info-inner {
  max-width: 260px;
  margin: 0 auto;
}

.user-icon {
  width: 28px;
  height: 28px;
}

.settings-icon {
  width: 22px;
  height: 22px;
}

.settings-link {
  color: #ffc107;
  text-decoration: none;
}

.settings-link:hover .settings-icon {
  transform: scale(1.05);
}

.user-name {
  font-size: 16px;
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
  text-decoration: none;
}

.logout-icon {
  width: 20px;
  height: 20px;
}

.timer-content {
  flex: 1;
  padding: 30px;
  background: #000;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

.timer-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.set-time {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #111;
  padding: 12px 18px;
  border-radius: 12px;
  border: 1px solid #222;
  margin-bottom: 30px;
}

.set-time-label {
  font-size: 14px;
  text-transform: uppercase;
  color: #ccc;
}

.set-time input {
  width: 60px;
  padding: 8px;
  font-size: 20px;
  border-radius: 8px;
  background: #000;
  border: 1px solid #444;
  color: #ffc107;
  text-align: center;
  font-weight: bold;
}

.set-time input:focus {
  outline: none;
  border-color: #ffc107;
}

.set-time-separator {
  font-size: 20px;
  font-weight: 700;
}

.set-time button {
  background: #ffc107;
  color: #000;
  padding: 10px 20px;
  font-size: 18px;
  border-radius: 10px;
  font-weight: bold;
  border: none;
  transition: 0.2s;
  cursor: pointer;
}

.set-time button:hover {
  background: #ffdb4d;
}

#display {
  font-size: 120px;
  font-weight: 900;
  letter-spacing: 4px;
  text-align: center;
  margin: 40px 0;
  color: #ffffff;
  text-shadow: 0 0 25px #ffc107aa;
  font-family: "Roboto Mono", monospace;
}

.timer-running #display {
  animation: pulse 1s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    text-shadow: 0 0 10px #ffc107;
  }
  50% {
    text-shadow: 0 0 35px #ffc107;
  }
  100% {
    text-shadow: 0 0 10px #ffc107;
  }
}

.controls {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 10px;
}

.controls button {
  padding: 16px 32px;
  font-size: 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  min-width: 150px;
  font-weight: bold;
  transition: 0.2s ease;
}

.controls button:first-child {
  background-color: #ffc107;
  color: black;
}

.controls button:first-child:hover:enabled {
  background-color: #ffdb4d;
}

.controls button:first-child:disabled {
  opacity: 0.5;
  cursor: default;
}

.controls button:last-child {
  background-color: #d32f2f;
  color: white;
}

.controls button:last-child:hover {
  background-color: #f44444;
}
</style>

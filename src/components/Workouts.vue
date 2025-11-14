<template>
  <div class="container-fluid">
    <div class="row min-vh-100">
      <aside class="sidebar col-12 col-md-3 bg-darka text-white p-3">
        <div class="logo mb-3">
          <img
            src="@/assets/logo-t.png"
            alt="IronScore Logo"
            class="img-fluid"
          />
        </div>
        <div class="user-info mb-3 border-top pt-2">
          <router-link to="/edit-account" class="edit d-block mb-2"
            >Edit Account</router-link
          >
          <p><strong>Name:</strong> {{ userStore.name }}</p>
          <p><strong>Surname:</strong> {{ userStore.surname }}</p>
        </div>
        <nav class="menu d-flex flex-column gap-2">
          <router-link to="/dashboard" class="menu-item active-item"
            >Dashboard</router-link
          >
          <router-link to="/competitions" class="menu-item"
            >Competitions</router-link
          >
          <router-link to="/community" class="menu-item">Community</router-link>
          <router-link to="/timer" class="menu-item">Timer</router-link>
          <router-link to="/trainings" class="menu-item">Trainings</router-link>
        </nav>
      </aside>

      <main class="workouts-content col-12 col-md-9 p-4 bg-black text-white">
        <header
          class="workouts-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 text-warning text-uppercase fw-bold"
        >
          <h2 class="title mb-2 mb-md-0">Dashboard</h2>
          <router-link
            to="/"
            class="btn btn-link text-warning fw-bold p-0 logout-link"
            >Log Out</router-link
          >
        </header>

        <section class="container-fluid">
          <div class="row g-4 align-items-start">
            <div class="col-md-8">
              <div class="card bg-dark text-white p-3 text-center">
                <h5 class="text-white mb-3">Workouts Per Week</h5>
                <canvas id="workoutsChart"></canvas>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card bg-white text-dark p-4">
                <h6 class="fw-bold mb-3">Date:</h6>
                <input
                  type="date"
                  class="form-control mb-3"
                  v-model="newDate"
                />

                <h6 class="fw-bold mb-3">Workouts:</h6>
                <input
                  type="number"
                  class="form-control mb-3"
                  v-model.number="newValue"
                  placeholder="5"
                  min="0"
                  step="0.5"
                />

                <button class="btn btn-dark w-100" @click="addWorkout">
                  Add
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user";
import { Chart, registerables } from "chart.js";
import { markRaw, nextTick } from "vue";

import { auth, db } from "@/firebase";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

Chart.register(...registerables);

export default {
  name: "Workouts",
  data() {
    return {
      chart: null,
      entries: [],
      newDate: "",
      newValue: null,
      unsub: null,
      stopAuthWatch: null,
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
  },
  created() {
    this.newDate = new Date().toISOString().slice(0, 10);

    this.stopAuthWatch = onAuthStateChanged(auth, (u) => {
      if (!u) {
        if (this.unsub) {
          this.unsub();
          this.unsub = null;
        }
        this.entries = [];
        this.rebuildChart();
        return;
      }
      if (this.unsub) {
        this.unsub();
        this.unsub = null;
      }
      const col = collection(db, "users", u.uid, "workoutEntries");
      const q = query(col, orderBy("date"));
      this.unsub = onSnapshot(q, (snap) => {
        this.entries = snap.docs.map((d) => d.data());
        this.rebuildChart();
      });
    });
  },
  mounted() {
    const ctx = document.getElementById("workoutsChart")?.getContext("2d");
    if (!ctx) return;
    const cfg = {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Workouts Per Week",
            data: [],
            borderColor: "rgba(255, 193, 7, 1)",
            backgroundColor: "rgba(255, 193, 7, 0.2)",
            tension: 0.3,
            fill: true,
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: "#fff" } },
          title: { display: false, text: "Workouts", fullSize: true },
        },
        scales: {
          x: { ticks: { color: "#ccc" }, grid: { color: "#333" } },
          y: {
            ticks: { color: "#ccc" },
            grid: { color: "#333" },
            suggestedMin: 0,
            suggestedMax: 10,
          },
        },
      },
    };
    this.chart = markRaw(new Chart(ctx, cfg));
    nextTick(() => this.rebuildChart());
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    if (this.unsub) {
      this.unsub();
      this.unsub = null;
    }
    if (this.stopAuthWatch) this.stopAuthWatch();
  },
  methods: {
    async addWorkout() {
      const uid = auth.currentUser?.uid;
      if (!uid) return alert("Prijavi se prije spremanja.");
      if (!this.newDate) return alert("Odaberi datum.");
      if (this.newValue === null || this.newValue < 0 || this.newValue > 21)
        return alert("Unesi broj treninga 0–21.");

      const payload = { date: this.newDate, workouts: Number(this.newValue) };
      const col = collection(db, "users", uid, "workoutEntries");
      await setDoc(doc(col, this.newDate), payload);
    },
    rebuildChart() {
      if (!this.chart) return;

      const cleanedEntries = this.entries
        .filter((e) => e && typeof e.date === "string" && e.date.trim() !== "")
        .map((e) => ({
          date: e.date,
          workouts: Number(e.workouts) || 0,
        }));

      if (cleanedEntries.length === 0) {
        this.chart.data.labels = [];
        this.chart.data.datasets[0].data = [];
        this.chart.update();
        return;
      }

      const labels = cleanedEntries.map((e) => e.date);
      const data = cleanedEntries.map((e) => e.workouts);

      if (!this.chart.data.datasets || !this.chart.data.datasets[0]) {
        this.chart.data.datasets = [
          {
            label: "Workouts Per Week",
            data: [],
            borderColor: "rgba(255, 193, 7, 1)",
            backgroundColor: "rgba(255, 193, 7, 0.2)",
            tension: 0.3,
            fill: true,
            pointRadius: 3,
          },
        ];
      }

      this.chart.data.labels = [...labels];
      this.chart.data.datasets[0].data = [...data];
      this.chart.update();
    },
  },
};
</script>

<style scoped>
.logo img {
  width: 100%;
}

.user-info {
  border-top: 1px solid #333;
  padding-top: 10px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  color: #fff;
  font-weight: bold;
  text-decoration: none;
  font-size: 20px;
  text-transform: uppercase;
}

.active-item {
  color: #ffc107 !important;
}

.workouts-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.workouts-header {
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

.logout-link {
  color: #ffc107 !important;
  font-size: 14px;
  text-transform: uppercase;
}

.edit {
  color: #ffc107;
}

.bg-darka {
  background-color: #000 !important;
}
</style>




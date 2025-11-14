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

      <main class="bmi-content col-12 col-md-9 p-4 bg-black text-white">
        <header
          class="bmi-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 text-warning text-uppercase fw-bold"
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
                <h5 class="text-white mb-3">BMI</h5>
                <canvas id="bmiChart"></canvas>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card bg-white text-dark p-4">
                <h6 class="fw-bold mb-2">Date:</h6>
                <input
                  type="date"
                  class="form-control mb-3"
                  v-model="newDate"
                />

                <div class="row">
                  <div class="col-6">
                    <h6 class="fw-bold mb-2">Weight (kg):</h6>
                    <input
                      type="number"
                      class="form-control mb-3"
                      v-model.number="newWeight"
                      step="0.1"
                      min="20"
                      placeholder="72.5"
                    />
                  </div>
                  <div class="col-6">
                    <h6 class="fw-bold mb-2">Height (cm):</h6>
                    <input
                      type="number"
                      class="form-control mb-3"
                      v-model.number="newHeightCm"
                      step="0.1"
                      min="80"
                      placeholder="178"
                    />
                  </div>
                </div>

                <div
                  class="alert alert-secondary py-2 mb-3"
                  v-if="calculatedBMI"
                >
                  <small
                    >Calculated BMI: <strong>{{ calculatedBMI }}</strong></small
                  >
                </div>

                <button class="btn btn-dark w-100" @click="addEntry">
                  Add
                </button>
              </div>
            </div>

            <div class="col-12">
              <div class="card bg-dark text-white p-3">
                <h6 class="mb-3">Saved entries</h6>
                <div class="table-responsive">
                  <table
                    class="table table-dark table-striped align-middle mb-0"
                  >
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th class="text-end">Weight (kg)</th>
                        <th class="text-end">Height (cm)</th>
                        <th class="text-end">BMI</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="e in entries" :key="e.date">
                        <td>{{ e.date }}</td>
                        <td class="text-end">{{ e.weight.toFixed(1) }}</td>
                        <td class="text-end">{{ e.height_cm.toFixed(1) }}</td>
                        <td class="text-end">{{ e.bmi.toFixed(1) }}</td>
                      </tr>
                      <tr v-if="entries.length === 0">
                        <td colspan="4" class="text-center text-muted">
                          No entries yet.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import { useUserStore } from "@/stores/user";
import { markRaw, nextTick } from "vue";

import { auth, db } from "@/firebase";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

Chart.register(...registerables);

export default {
  name: "BMI",
  data() {
    return {
      chart: null,
      newDate: "",
      newWeight: null,
      newHeightCm: null,
      entries: [],
      unsub: null,
      stopAuthWatch: null,
    };
  },
  async created() {
    this.newDate = new Date().toISOString().slice(0, 10);
    await this.userStore.fetchUser();

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
      const col = collection(db, "users", u.uid, "bmiEntries");
      const q = query(col, orderBy("date"));
      this.unsub = onSnapshot(q, (snap) => {
        this.entries = snap.docs.map((d) => d.data());
        this.rebuildChart();
      });
    });
  },
  mounted() {
    const ctx = document.getElementById("bmiChart")?.getContext("2d");
    if (!ctx) return;

    const config = {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "BMI",
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
          title: { display: false, text: "BMI", fullSize: true },
          legend: { display: true, labels: { color: "#fff" } },
          tooltip: {
            callbacks: {
              label: (c) => `BMI: ${Number(c.parsed.y).toFixed(1)}`,
            },
          },
        },
        scales: {
          x: { ticks: { color: "#ccc" }, grid: { color: "#333" } },
          y: {
            ticks: { color: "#ccc" },
            grid: { color: "#333" },
            suggestedMin: 15,
            suggestedMax: 35,
          },
        },
      },
    };

    this.chart = markRaw(new Chart(ctx, config));
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
  computed: {
    userStore() {
      return useUserStore();
    },
    calculatedBMI() {
      if (!this.newWeight || !this.newHeightCm) return null;
      const h = this.newHeightCm / 100;
      if (h <= 0) return null;
      const bmi = this.newWeight / (h * h);
      return Number.isFinite(bmi) ? bmi.toFixed(1) : null;
    },
  },
  methods: {
    async addEntry() {
      const uid = auth.currentUser?.uid;
      if (!uid) return alert("Prijavi se prije spremanja.");
      if (!this.newDate) return alert("Odaberi datum.");
      if (!this.newWeight || this.newWeight < 20 || this.newWeight > 400)
        return alert("Unesi težinu 20–400 kg.");
      if (!this.newHeightCm || this.newHeightCm < 80 || this.newHeightCm > 250)
        return alert("Unesi visinu 80–250 cm.");

      const h = this.newHeightCm / 100;
      const payload = {
        date: this.newDate,
        weight: Number(this.newWeight),
        height_cm: Number(this.newHeightCm),
        bmi: Number(this.newWeight / (h * h)),
      };

      const col = collection(db, "users", uid, "bmiEntries");
      await setDoc(doc(col, this.newDate), payload);
    },
    rebuildChart() {
      if (!this.chart) return;
      const labels = this.entries.map((e) => e.date);
      const data = this.entries.map((e) => Number(e.bmi.toFixed(1)));
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

.bmi-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.bmi-header {
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



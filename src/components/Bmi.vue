<template>
  <div class="bmi-container">
    <aside class="sidebar">
      <div class="logo">
        <img src="@/assets/logo-t.png" alt="IronScore Logo" />
      </div>
      <div class="user-info">
        <router-link to="/edit-account" class="edit">Edit Account</router-link>
        <p><strong>Name:</strong> Example</p>
        <p><strong>Surname:</strong> Example</p>
        <p><strong>Email:</strong> example@gmail.com</p>
        <p><strong>Age:</strong> 25</p>
        <p><strong>Account type:</strong> Regular</p>
      </div>
      <nav class="menu">
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

    <main class="bmi-content">
      <header class="bmi-header">
        <h2 class="title">Dashboard</h2>
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
              <h6 class="fw-bold mb-3">Date:</h6>
              <input type="date" class="form-control mb-3" v-model="newDate" />

              <h6 class="fw-bold mb-3">BMI:</h6>
              <input
                type="number"
                class="form-control mb-3"
                v-model="newValue"
                placeholder="25.8"
              />

              <button class="btn btn-dark w-100" @click="addBMI">Add</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  name: "BMI",
  data() {
    return {
      chart: null,
      newDate: "",
      newValue: "",
      chartLabels: ["Mar 1", "Mar 8", "Mar 15", "Mar 22", "Mar 29", "Apr 5"],
      chartData: [25.5, 25.6, 25.6, 25.8, 25.8, 25.6],
    };
  },
  mounted() {
    const ctx = document.getElementById("bmiChart").getContext("2d");
    this.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            label: "BMI",
            data: this.chartData,
            borderColor: "rgba(255, 87, 34, 1)",
            backgroundColor: "rgba(255, 87, 34, 0.2)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: "#fff" } },
        },
        scales: {
          x: {
            ticks: { color: "#ccc" },
            grid: { color: "#333" },
          },
          y: {
            ticks: { color: "#ccc" },
            grid: { color: "#333" },
          },
        },
      },
    });
  },
  methods: {
    addBMI() {
      if (this.newDate && this.newValue) {
        this.chart.data.labels.push(this.newDate);
        this.chart.data.datasets[0].data.push(parseFloat(this.newValue));
        this.chart.update();
        this.newDate = "";
        this.newValue = "";
      }
    },
  },
};
</script>

<style scoped>
.bmi-container {
  display: flex;
  height: 100vh;
  font-family: "Roboto", sans-serif;
  background: #000;
  color: #fff;
}

.sidebar {
  width: 250px;
  background: #111;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

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
</style>

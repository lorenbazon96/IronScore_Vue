<template>
  <div class="container-fluid">
    <div class="row min-vh-100">
      <aside class="sidebar col-12 col-md-3 bg-dark text-white p-3">
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
          <p><strong>Name:</strong> Example</p>
          <p><strong>Surname:</strong> Example</p>
          <p><strong>Email:</strong> example@gmail.com</p>
          <p><strong>Age:</strong> 25</p>
          <p><strong>Account type:</strong> Regular</p>
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

      <main class="weight-content col-12 col-md-9 p-4 bg-black text-white">
        <header
          class="weight-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 text-warning text-uppercase fw-bold"
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
                <h5 class="text-white mb-3">Weight (kg)</h5>
                <canvas id="weightChart"></canvas>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card bg-white text-dark p-4">
                <h6 class="fw-bold mb-3">Date:</h6>
                <input
                  type="date"
                  class="form-control mb-3"
                  value="2025-05-02"
                />
                <h6 class="fw-bold mb-3">Weight:</h6>
                <input
                  type="text"
                  class="form-control mb-3"
                  placeholder="80.0"
                />
                <button class="btn btn-dark w-100">Add</button>
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
Chart.register(...registerables);

export default {
  name: "Weight",
  data() {
    return {};
  },
  mounted() {
    const ctx = document.getElementById("weightChart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Mar 1",
          "Mar 8",
          "Mar 15",
          "Mar 22",
          "Mar 29",
          "Apr 5",
          "Apr 12",
        ],
        datasets: [
          {
            label: "Weight (kg)",
            data: [78.0, 78.4, 78.9, 79.4, 80.0, 79.7, 79.2],
            borderColor: "rgba(255, 193, 7, 1)",
            backgroundColor: "rgba(255, 193, 7, 0.2)",
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
  color: #ffffff;
  font-weight: bold;
  text-decoration: none;
  font-size: 20px;
  text-transform: uppercase;
}

.active-item {
  color: #ffc107 !important;
}

.weight-content {
  flex: 1;
  padding: 30px;
  background: #000;
  overflow-y: auto;
}

.weight-header {
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

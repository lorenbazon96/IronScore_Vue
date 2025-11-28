<template>
  <div class="card bg-dark text-white p-3">
    <h5 class="text-white mb-3">{{ title }}</h5>
    <canvas ref="chartCanvas" class="mb-3"></canvas>
    <button
      class="btn btn-warning btn-sm fw-bold flex-grow-1 me-2"
      @click="navigate"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: "DashboardCard",
  props: {
    title: String,
    chartData: {
      type: Array,
      required: true,
    },
    buttonText: String,
    route: String,
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const ctx = this.$refs.chartCanvas.getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Mar 1", "Mar 8", "Mar 15", "Mar 22", "Mar 29", "Apr 5"],
          datasets: [
            {
              label: this.title,
              data: this.chartData,
              borderColor: this.getColor(),
              backgroundColor: this.getColor(0.2),
              fill: true,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: "#fff",
              },
            },
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
    getColor(alpha = 1) {
      if (this.title.includes("Weight")) return `rgba(255, 193, 7, ${alpha})`;
      if (this.title.includes("Workouts")) return `rgba(255, 193, 7, ${alpha})`;
      if (this.title.includes("BMI")) return `rgba(255, 193, 7, ${alpha})`;
      return `rgba(255, 255, 255, ${alpha})`;
    },
    navigate() {
      if (this.route) {
        this.$router.push(this.route);
      }
    },
  },
};
</script>

<style scoped>
.card {
  height: 100%;
  min-height: 300px;
}

canvas {
  width: 100%;
  height: 200px !important;
}
</style>

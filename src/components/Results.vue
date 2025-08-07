<template>
  <div class="training-container">
    <aside class="sidebar">
      <div class="logo">
        <img src="@/assets/logo-t.png" alt="IronScore Logo" />
      </div>
      <div class="user-info">
        <router-link to="/edit-account" class="edit">Edit Account</router-link>
        <p><strong>Name:</strong> {{ userStore.name }}</p>
        <p><strong>Surname:</strong> {{ userStore.surname }}</p>
        <p><strong>Email:</strong> {{ userStore.email }}</p>
        <p><strong>Age:</strong> {{ userStore.age }}</p>
      </div>
      <nav class="menu">
        <router-link to="/dashboard" class="menu-item">Dashboard</router-link>
        <router-link to="/competitions" class="menu-item active-item"
          >competitions</router-link
        >
        <router-link to="/community" class="menu-item">Community</router-link>
        <router-link to="/timer" class="menu-item">Timer</router-link>
        <router-link to="/trainings" class="menu-item">Trainings</router-link>
      </nav>
    </aside>

    <main class="training-content container-fluid px-5">
      <header class="training-header trainings-header">
        <h2 class="trainings-title">Final Results</h2>
        <router-link
          to="/"
          class="btn btn-link text-warning fw-bold p-0 logout-link"
        >
          Log Out
        </router-link>
      </header>

      <h4 class="text-white text-uppercase fw-bold mb-4">
        Ultimate Physique Championships
      </h4>

      <div class="bg-white text-black p-4 rounded">
        <h5 class="text-uppercase fw-bold mb-3">Competitor Results</h5>
        <table class="table table-bordered table-striped">
          <thead class="table-dark">
            <tr>
              <th>#</th>
              <th>Category</th>
              <th>Grades</th>
              <th>Average Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(competitor, index) in finalResults" :key="index">
              <td>Competitor {{ index + 1 }}</td>
              <td>{{ competitor.category }}</td>
              <td>{{ competitor.grades.join(", ") }}</td>
              <td>{{ average(competitor.grades).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user";
export default {
  name: "ResultsR",
  data() {
    return {
      // Simulacija podataka svih sudaca po natjecatelju
      finalResults: [
        {
          category: "Men's Physique",
          grades: [8, 9, 7, 8],
        },
        {
          category: "Classic Bodybuilding",
          grades: [9, 8, 10],
        },
        {
          category: "Women's Figure",
          grades: [7, 7, 8, 7],
        },
        {
          category: "Men's Physique",
          grades: [6, 8, 7],
        },
      ],
    };
  },
  methods: {
    average(grades) {
      const sum = grades.reduce((a, b) => a + b, 0);
      return grades.length ? sum / grades.length : 0;
    },
  },
  computed: {
    userStore() {
      return useUserStore();
    },
  },
};
</script>

<style scoped>
.training-container {
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
  color: #ffffff;
  font-weight: bold;
  text-decoration: none;
  font-size: 20px;
  text-transform: uppercase;
}

.training-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.training-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffc107;
  text-transform: uppercase;
}

.trainings-title {
  font-size: 2rem;
  font-weight: bold;
  color: #ffc107;
}

.logout-link {
  color: #ffc107 !important;
  font-size: 14px;
  text-transform: uppercase;
}

.edit {
  color: #ffc107;
}

.active-item {
  color: #ffc107 !important;
}
</style>

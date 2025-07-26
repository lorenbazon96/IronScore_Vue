<template>
  <div class="dashboard-container">
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
          >competitions</router-link
        >
        <router-link to="/community" class="menu-item">Community</router-link>
        <router-link to="/timer" class="menu-item">Timer</router-link>
        <router-link to="/trainings" class="menu-item">Trainings</router-link>
      </nav>
    </aside>

    <main class="dashboard-content">
      <header class="dashboard-header">
        <h2 class="title">Dashboard</h2>
        <router-link
          to="/"
          class="btn btn-link text-warning fw-bold p-0 logout-link"
          >Log Out</router-link
        >
      </header>

      <section class="container-fluid px-0">
        <div class="row g-4">
          <div class="col-md-6">
            <DashboardCard
              title="Weight (kg)"
              :chart-data="weightData"
              button-text="View more about weight"
              route="/weight"
            />
          </div>

          <div
            class="col-md-6 d-flex flex-column align-items-center justify-content-center"
          >
            <img
              src="@/assets/goal.png"
              alt="My Goals"
              class="img-fluid"
              style="max-width: 250px"
            />
            <router-link to="/goals" class="btn btn-warning fw-bold mt-3"
              >My goals</router-link
            >
          </div>

          <div class="col-md-6">
            <DashboardCard
              title="Workouts Per Week"
              :chart-data="workoutData"
              button-text="View more about workouts"
              route="/workouts"
            />
          </div>

          <div class="col-md-6">
            <DashboardCard
              title="BMI"
              :chart-data="bmiData"
              button-text="View more about BMI"
              route="/bmi"
            />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Dashboard from "@/components/Dashboard.vue";
import DashboardCard from "@/components/DashboardCard.vue";

export default {
  name: "Dashboard",
  components: {
    Dashboard,
    DashboardCard,
  },
  data() {
    return {
      weightData: [78.1, 78.8, 79.3, 79.9, 80.0, 79.7],
      workoutData: [3, 4.5, 5, 3, 6, 4.8],
      bmiData: [25.5, 25.6, 25.6, 25.8, 25.8, 25.6],
    };
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  font-family: "Roboto", sans-serif;
  color: #fff;
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

.dashboard-content {
  flex: 1;
  padding: 30px;
  background: #000;
  overflow-y: auto;
}

.dashboard-header {
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

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.medal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #111;
  padding: 20px;
  border-radius: 10px;
}

.gold-button {
  background: #ffc107;
  color: #000;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 5px;
}

.edit {
  color: #ffc107;
}
</style>

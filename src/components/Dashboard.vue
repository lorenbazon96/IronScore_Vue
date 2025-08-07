<template>
  <div class="container-fluid">
    <div class="row min-vh-100">
      <aside class="col-12 col-md-3 bg-dark text-white p-3">
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
          <p><strong>Email:</strong> {{ userStore.email }}</p>
          <p><strong>Age:</strong> {{ userStore.age }}</p>
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

      <main class="dashboard-content col-12 col-md-9 p-4 bg-black text-white">
        <header
          class="dashboard-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 text-warning text-uppercase fw-bold"
        >
          <h2 class="title mb-2 mb-md-0">Dashboard</h2>
          <router-link
            to="/"
            class="btn btn-link text-warning p-0 fw-bold logout-link"
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
  </div>
</template>

<script>
import Dashboard from "@/components/Dashboard.vue";
import DashboardCard from "@/components/DashboardCard.vue";
import { useUserStore } from "@/stores/user";

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
  computed: {
    userStore() {
      return useUserStore();
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

.edit {
  color: #ffc107;
}
</style>

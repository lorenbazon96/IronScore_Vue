<template>
  <div class="container-fluid">
    <div class="row min-vh-100">
      <aside class="col-12 col-md-3 bg-darka text-white p-3">
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
              to="/edit-account"
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

            <div class="col-md-6">
              <DashboardGoalsCard :goals="goals" @add="openAddGoalModal" />
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
        <div
          v-if="showAddGoalModal"
          class="modal-overlay"
          @click.self="showAddGoalModal = false"
        >
          <div class="modal-box bg-dark text-white p-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="mb-0 text-uppercase fw-bold">Add new goal</h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                aria-label="Close"
                @click="showAddGoalModal = false"
              ></button>
            </div>

            <p class="small text-white-50 mb-3">
              Define a clear goal and short description so you can easily track
              your progress.
            </p>

            <div class="mb-3">
              <label class="form-label small text-uppercase text-white-50"
                >Goal title</label
              >
              <input
                type="text"
                v-model="newGoal.title"
                class="form-control bg-secondary text-white border-0"
                placeholder="Do 50 push-ups in one set"
              />
            </div>

            <div class="mb-4">
              <label class="form-label small text-uppercase text-white-50"
                >Description</label
              >
              <input
                type="text"
                v-model="newGoal.description"
                class="form-control bg-secondary text-white border-0"
                placeholder="Practice 3 times per week..."
              />
            </div>

            <button class="btn btn-warning w-100 fw-bold" @click="addGoal">
              Add Goal
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Dashboard from "@/components/Dashboard.vue";
import DashboardCard from "@/components/DashboardCard.vue";
import { useUserStore } from "@/stores/user";
import DashboardGoalsCard from "@/components/DashboardGoalsCard.vue";
import { db } from "@/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export default {
  name: "Dashboard",
  components: {
    Dashboard,
    DashboardCard,
    DashboardGoalsCard,
  },
  data() {
    return {
      weightData: [78.1, 78.8, 79.3, 79.9, 80.0, 79.7],
      workoutData: [3, 4.5, 5, 3, 6, 4.8],
      bmiData: [25.5, 25.6, 25.6, 25.8, 25.8, 25.6],
      goals: [],
      showAddGoalModal: false,
      newGoal: { title: "", description: "", completed: false },
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
  },
  async mounted() {
    await this.fetchGoals();
  },
  methods: {
    openAddGoalModal() {
      this.newGoal = { title: "", description: "", completed: false };
      this.showAddGoalModal = true;
    },
    async fetchGoals() {
      const q = await getDocs(
        collection(db, "users", this.userStore.uid, "goals")
      );
      this.goals = q.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
    async addGoal() {
      if (!this.newGoal.title.trim()) return;

      await addDoc(
        collection(db, "users", this.userStore.uid, "goals"),
        this.newGoal
      );

      this.newGoal = { title: "", description: "", completed: false };
      this.showAddGoalModal = false;

      await this.fetchGoals();
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

.bg-darka {
  background-color: #000 !important;
}

.user-info {
  border-top: 1px solid #333;
  padding: 10px 15px 0 15px;
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

.user-info-inner {
  max-width: 260px;
  margin: 0 auto;
}

.logout-icon {
  width: 20px;
  height: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
}

.modal-box {
  width: 90%;
  max-width: 420px;
  border-radius: 12px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.7);
  border-top: 3px solid #ffc107;
}

.modal-box .form-control::placeholder {
  color: #cccccc;
  font-size: 0.9rem;
}

.modal-box .form-control:focus {
  box-shadow: none;
}
</style>

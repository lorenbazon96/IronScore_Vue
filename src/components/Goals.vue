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
            >Progress</router-link
          >
          <router-link to="/competitions" class="menu-item"
            >Competitions</router-link
          >
          <router-link to="/community" class="menu-item">Community</router-link>
          <router-link to="/timer" class="menu-item">Timer</router-link>
          <router-link to="/trainings" class="menu-item">Trainings</router-link>
        </nav>
      </aside>

      <main class="goals-content col-12 col-md-9 p-4 bg-black text-white">
        <header
          class="goals-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 text-warning text-uppercase fw-bold"
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

        <section class="container-fluid">
          <div class="row justify-content-center">
            <div class="col-12 col-lg-8">
              <div class="card bg-dark text-white p-4 goals-card">
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <div>
                    <h3 class="mb-0 text-uppercase fw-bold">My Goals</h3>
                    <small class="text-white-50">
                      {{ completedCount }} / {{ goals.length }} completed
                    </small>
                  </div>

                  <div
                    v-if="goals.length"
                    class="goals-progress-circle d-flex flex-column align-items-center justify-content-center"
                  >
                    <span class="goals-progress-percent"
                      >{{ progressPercent }}%</span
                    >
                    <span class="goals-progress-label">Done</span>
                  </div>
                </div>

                <div class="goal-list border-top border-secondary pt-3 mb-3">
                  <div v-if="goals.length" class="goal-list-inner">
                    <div
                      v-for="goal in goals"
                      :key="goal.id"
                      class="goal-row d-flex align-items-center"
                    >
                      <label class="switch me-3">
                        <input
                          type="checkbox"
                          v-model="goal.completed"
                          @change="toggleGoal(goal.id, goal.completed)"
                        />
                        <span class="slider round"></span>
                      </label>

                      <div class="flex-grow-1">
                        <p
                          class="mb-1 fw-bold"
                          :class="{
                            'text-decoration-line-through text-white-50':
                              goal.completed,
                          }"
                        >
                          {{ goal.title }}
                        </p>
                        <p class="mb-0 text-white-50 small">
                          {{ goal.description }}
                        </p>
                      </div>

                      <button
                        type="button"
                        class="btn btn-link btn-sm text-muted delete-btn ms-2"
                        @click="removeGoal(goal.id)"
                      >
                        <img
                          src="@/assets/trash.png"
                          alt="Delete"
                          class="delete-icon"
                        />
                      </button>
                    </div>
                  </div>

                  <p v-else class="text-white-50 mb-0 small">
                    You don’t have any goals yet. Add your first one below.
                  </p>
                </div>

                <div class="add-goal-area pt-3 border-top border-secondary">
                  <h6 class="text-uppercase small text-white-50 mb-2">
                    Add new goal
                  </h6>

                  <div class="row g-2">
                    <div class="col-12 col-md-4">
                      <input
                        type="text"
                        v-model="newGoal.title"
                        class="form-control bg-secondary text-white border-0"
                        placeholder="Goal title"
                      />
                    </div>

                    <div class="col-12 col-md-6">
                      <input
                        type="text"
                        v-model="newGoal.description"
                        class="form-control bg-secondary text-white border-0"
                        placeholder="Short description"
                      />
                    </div>

                    <div class="col-12 col-md-2 d-grid">
                      <button class="btn btn-warning fw-bold" @click="addGoal">
                        Add
                      </button>
                    </div>
                  </div>
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
import { useUserStore } from "@/stores/user";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default {
  name: "Goals",
  data() {
    return {
      goals: [],
      newGoal: { title: "", description: "", completed: false },
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    completedCount() {
      return this.goals.filter((g) => g.completed).length;
    },
    progressPercent() {
      if (!this.goals.length) return 0;
      return Math.round((this.completedCount / this.goals.length) * 100);
    },
  },
  async mounted() {
    await this.fetchGoals();
  },
  methods: {
    async fetchGoals() {
      const querySnapshot = await getDocs(
        collection(db, "users", this.userStore.uid, "goals")
      );
      this.goals = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
    },
    async addGoal() {
      if (!this.newGoal.title.trim()) return;
      await addDoc(
        collection(db, "users", this.userStore.uid, "goals"),
        this.newGoal
      );
      this.newGoal = { title: "", description: "", completed: false };
      await this.fetchGoals();
    },
    async removeGoal(id) {
      await deleteDoc(doc(db, "users", this.userStore.uid, "goals", id));
      await this.fetchGoals();
    },
    async toggleGoal(id, completed) {
      await updateDoc(doc(db, "users", this.userStore.uid, "goals", id), {
        completed,
      });
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

.goals-content {
  flex: 1;
  padding: 30px;
  background: #000;
  overflow-y: auto;
}

.goals-header {
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
  text-decoration: none;
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

.goals-card {
  border-radius: 12px;
}

.goals-progress-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid #ffc107;
}

.goals-progress-percent {
  font-size: 1rem;
  font-weight: 700;
  color: #ffc107;
  line-height: 1;
}

.goals-progress-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #ffffffa0;
}

.goal-list {
  max-height: 380px;
}

.goal-list-inner {
  max-height: 330px;
  overflow-y: auto;
  padding-right: 4px;
}

.goal-row {
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.goal-row:last-child {
  border-bottom: none;
}

.delete-btn {
  padding: 0;
  border: none;
}

.delete-btn:hover .delete-icon {
  transform: scale(1.05);
}

.delete-icon {
  width: 25px;
  height: 25px;
  opacity: 0.7;
  transition: transform 0.1s ease, opacity 0.1s ease;
  padding-right: 10px !important;
}

.delete-btn:hover .delete-icon {
  opacity: 1;
}

.add-goal-area .form-control::placeholder {
  color: #cccccc;
  font-size: 0.85rem;
}

.add-goal-area .form-control:focus {
  box-shadow: none;
}

.switch {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 22px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #555;
  transition: 0.2s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: #fff;
  transition: 0.2s;
  border-radius: 50%;
}

.switch input:checked + .slider {
  background-color: #ffc107;
}

.switch input:checked + .slider:before {
  transform: translateX(18px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>

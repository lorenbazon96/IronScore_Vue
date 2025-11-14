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
          <router-link to="/edit-account" class="edit d-block mb-2">
            Edit Account
          </router-link>
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

      <main class="goals-content col-12 col-md-9 p-4 bg-black text-white">
        <header
          class="goals-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 text-warning text-uppercase fw-bold"
        >
          <h2 class="title mb-2 mb-md-0">Dashboard</h2>
          <router-link
            to="/"
            class="btn btn-link text-warning fw-bold p-0 logout-link"
          >
            Log Out
          </router-link>
        </header>

        <section class="container-fluid">
          <h3 class="text-white text-uppercase fw-bold mb-4">My Goals</h3>
          <div class="row g-4">
            <div class="col-md-8">
              <div class="card bg-dark text-white p-4">
                <h5 class="fw-bold text-uppercase mb-4">Goal List</h5>

                <div v-for="goal in goals" :key="goal.id" class="mb-4">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="goal.completed"
                      @change="toggleGoal(goal.id, goal.completed)"
                    />
                    <label class="form-check-label fw-bold text-white">
                      {{ goal.title }}
                    </label>
                  </div>
                  <p class="text-white-50 mb-0">
                    {{ goal.description }}
                    <span
                      class="text-danger ms-2"
                      style="cursor: pointer"
                      @click="removeGoal(goal.id)"
                      >Remove</span
                    >
                  </p>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card p-4 bg-white text-dark">
                <h6 class="fw-bold mb-3">Add new goal:</h6>
                <div class="mb-3">
                  <input
                    type="text"
                    class="form-control"
                    v-model="newGoal.title"
                    placeholder="Held a plank 10 minutes..."
                  />
                </div>
                <div class="mb-3">
                  <input
                    type="text"
                    class="form-control"
                    v-model="newGoal.description"
                    placeholder="how..."
                  />
                </div>
                <button class="btn btn-dark w-100" @click="addGoal">Add</button>
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
}

.edit {
  color: #ffc107;
}

.bg-darka {
  background-color: #000 !important;
}
</style>

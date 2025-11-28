<template>
  <div class="container-fluid">
    <div class="row min-vh-100">
      <aside class="col-12 col-md-3 sidebar bg-darka text-white p-3">
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
          <router-link to="/dashboard" class="menu-item">Dashboard</router-link>
          <router-link to="/competitions" class="menu-item active-item"
            >Competitions</router-link
          >
          <router-link to="/community" class="menu-item">Community</router-link>
          <router-link to="/timer" class="menu-item">Timer</router-link>
          <router-link to="/trainings" class="menu-item">Trainings</router-link>
        </nav>
      </aside>

      <main
        class="col-12 col-md-9 competitions-content p-4 bg-black text-white"
      >
        <header
          class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4"
        >
          <h2 class="title text-warning fw-bold text-uppercase mb-2 mb-md-0">
            Competitions
          </h2>
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

        <section>
          <h3 class="text-white text-uppercase fw-bold mb-3">
            Create New Competition
          </h3>
          <div class="row justify-content-center">
            <div class="col-md-10">
              <div class="card text-white p-4 border border-secondary">
                <form @submit.prevent="addCompetition">
                  <div class="mb-3">
                    <label
                      for="name"
                      class="form-label d-flex align-items-start"
                      >Name of competition:</label
                    >
                    <input
                      type="text"
                      v-model="competition.name"
                      class="form-control bg-dark text-white border-secondary"
                      id="name"
                      placeholder="Arnold Classic"
                    />
                  </div>

                  <div class="mb-3">
                    <label
                      for="date"
                      class="form-label d-flex align-items-start"
                      >Date</label
                    >
                    <input
                      type="date"
                      v-model="competition.date"
                      class="form-control bg-dark text-white border-secondary"
                      id="date"
                    />
                  </div>

                  <div class="mb-3">
                    <label
                      for="location"
                      class="form-label d-flex align-items-start"
                      >Location</label
                    >
                    <input
                      type="text"
                      v-model="competition.location"
                      class="form-control bg-dark text-white border-secondary"
                      id="location"
                      placeholder="London"
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label d-flex align-items-start"
                      >Referees</label
                    >
                    <input
                      v-for="(ref, index) in competition.referees"
                      :key="index"
                      type="text"
                      v-model="competition.referees[index]"
                      class="form-control bg-dark text-white border-secondary mb-1"
                      :placeholder="'Referee ' + (index + 1)"
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label d-flex align-items-start"
                      >Categories</label
                    >
                    <input
                      v-for="(cat, index) in competition.categories"
                      :key="index"
                      type="text"
                      v-model="competition.categories[index]"
                      class="form-control bg-dark text-white border-secondary mb-1"
                      :placeholder="'Category ' + (index + 1)"
                    />
                  </div>

                  <div class="mb-3">
                    <label
                      for="info"
                      class="form-label d-flex align-items-start"
                      >More information</label
                    >
                    <textarea
                      v-model="competition.info"
                      class="form-control bg-dark text-white border-secondary"
                      id="info"
                      rows="3"
                      placeholder="conditions, course of the competition, time of award ceremony,..."
                    ></textarea>
                  </div>

                  <button type="submit" class="btn btn-warning w-100 fw-bold">
                    Submit
                  </button>
                </form>
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
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  name: "Ncompetitions",
  data() {
    return {
      competition: {
        name: "",
        date: "",
        location: "",
        referees: Array(10).fill(""),
        categories: Array(10).fill(""),
        info: "",
      },
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
  },
  methods: {
    async addCompetition() {
      try {
        const auth = getAuth();
        const userId = auth.currentUser?.uid;

        if (!userId) {
          alert("You must be logged in to add a competition.");
          return;
        }

        const filteredReferees = this.competition.referees.filter(
          (r) => r.trim() !== ""
        );
        const filteredCategories = this.competition.categories.filter(
          (c) => c.trim() !== ""
        );

        await addDoc(collection(db, "competitions"), {
          name: this.competition.name,
          date: this.competition.date,
          location: this.competition.location,
          referees: filteredReferees,
          categories: filteredCategories,
          info: this.competition.info,
          createdAt: new Date(),
        });

        alert("Competition added successfully!");
        this.competition = {
          name: "",
          date: "",
          location: "",
          referees: Array(10).fill(""),
          categories: Array(10).fill(""),
          info: "",
        };
      } catch (error) {
        console.error("Error adding competition:", error);
        alert("Failed to add competition. Check console for details.");
      }
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

.competitions-content {
  flex: 1;
  padding: 30px;
  background: #000;
  overflow-y: auto;
}

.title {
  font-weight: bold;
}

.logout-link {
  color: #ffc107 !important;
  font-size: 14px;
  text-transform: uppercase;
}

input::placeholder,
textarea::placeholder {
  color: #bbb;
}

.card {
  background-color: rgb(17, 17, 17);
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
</style>

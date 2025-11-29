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
          <router-link to="/dashboard" class="menu-item">Progress</router-link>
          <router-link to="/competitions" class="menu-item active-item"
            >Competitions</router-link
          >
          <router-link to="/community" class="menu-item">Community</router-link>
          <router-link to="/timer" class="menu-item">Timer</router-link>
          <router-link to="/trainings" class="menu-item">Trainings</router-link>
        </nav>
      </aside>

      <main class="col-12 col-md-9 competitions-content bg-black text-white">
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

        <section class="form-wrapper">
          <h3 class="text-white text-uppercase fw-bold mb-3">
            Create New Competition
          </h3>
          <p class="small mb-4">
            Fill in basic information, referees and categories. You can leave
            unused referee/category fields empty.
          </p>

          <div class="row justify-content-center">
            <div class="col-lg-10">
              <div
                class="card competition-form-card text-white border border-secondary"
              >
                <form @submit.prevent="addCompetition">
                  <div class="section-header mb-3">
                    <h5 class="section-title mb-0">Basic information</h5>
                  </div>

                  <div class="row">
                    <div class="col-12 mb-3">
                      <label
                        for="name"
                        class="form-label d-flex align-items-start"
                      >
                        Name of competition
                      </label>
                      <input
                        type="text"
                        v-model="competition.name"
                        class="form-control form-control-dark"
                        id="name"
                        placeholder="Arnold Classic"
                      />
                    </div>

                    <div class="col-md-6 mb-3">
                      <label
                        for="date"
                        class="form-label d-flex align-items-start"
                      >
                        Date
                      </label>
                      <input
                        type="date"
                        v-model="competition.date"
                        class="form-control form-control-dark"
                        id="date"
                      />
                    </div>

                    <div class="col-md-6 mb-3">
                      <label
                        for="location"
                        class="form-label d-flex align-items-start"
                      >
                        Location
                      </label>
                      <input
                        type="text"
                        v-model="competition.location"
                        class="form-control form-control-dark"
                        id="location"
                        placeholder="Zagreb, Croatia"
                      />
                    </div>
                  </div>

                  <hr class="section-divider" />

                  <div class="section-header mb-2">
                    <h5 class="section-title mb-0">Referees</h5>
                    <span class="section-subtitle">
                      Up to {{ competition.referees.length }} referees — leave
                      unused rows empty.
                    </span>
                  </div>

                  <div class="row">
                    <div
                      class="col-md-6 mb-2"
                      v-for="(ref, index) in competition.referees"
                      :key="'ref-' + index"
                    >
                      <input
                        type="text"
                        v-model="competition.referees[index]"
                        class="form-control form-control-dark"
                        :placeholder="'Referee ' + (index + 1)"
                      />
                    </div>
                  </div>

                  <hr class="section-divider" />

                  <div class="section-header mb-2">
                    <h5 class="section-title mb-0">Categories</h5>
                    <span class="section-subtitle">
                      Up to {{ competition.categories.length }} categories.
                    </span>
                  </div>

                  <div class="row">
                    <div
                      class="col-md-6 mb-2"
                      v-for="(cat, index) in competition.categories"
                      :key="'cat-' + index"
                    >
                      <input
                        type="text"
                        v-model="competition.categories[index]"
                        class="form-control form-control-dark"
                        :placeholder="'Category ' + (index + 1)"
                      />
                    </div>
                  </div>

                  <hr class="section-divider" />

                  <div class="mb-3">
                    <div class="section-header mb-1">
                      <h5 class="section-title mb-0">Additional information</h5>
                      <span class="section-subtitle">
                        Conditions, schedule, award ceremony, notes for
                        athletes…
                      </span>
                    </div>
                    <textarea
                      v-model="competition.info"
                      class="form-control form-control-dark"
                      id="info"
                      rows="4"
                      placeholder="Example: check-in time, poses, judging criteria, mandatory equipment..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    class="btn btn-warning w-100 fw-bold mt-2"
                  >
                    Submit competition
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

.bg-darka {
  background-color: #000 !important;
}

.user-info {
  border-top: 1px solid #333;
  padding: 10px 15px 0 15px;
}

.user-info-inner {
  max-width: 260px;
  margin: 0 auto;
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

.logout-link {
  color: #ffc107 !important;
  font-size: 14px;
  text-transform: uppercase;
  text-decoration: none;
}

.logout-icon {
  width: 20px;
  height: 20px;
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

.form-wrapper {
  max-width: 1100px;
  margin: 0 auto;
}

.competition-form-card {
  background-color: #111;
  border-radius: 16px;
  padding: 24px 24px 28px;
  box-shadow: 0 0 18px rgba(0, 0, 0, 0.7);
}

.form-control-dark {
  background-color: #000;
  color: #fff;
  border: 1px solid #444;
  border-radius: 10px;
  font-size: 0.95rem;
}

.form-control-dark:focus {
  outline: none;
  border-color: #ffc107;
  box-shadow: 0 0 0 0.15rem rgba(255, 193, 7, 0.25);
}

input::placeholder,
textarea::placeholder {
  color: #999;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.section-title {
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #ffc107;
}

.section-subtitle {
  font-size: 0.8rem;
  color: #aaa;
}

.section-divider {
  border-color: #333;
  margin: 1rem 0 1.1rem;
}
</style>

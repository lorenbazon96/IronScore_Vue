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
        <div class="user-info border-top pt-2 mb-3">
          <router-link to="/edit-r-account" class="edit d-block mb-2"
            >Edit Account</router-link
          >
          <p><strong>Name:</strong> {{ userStore.name }}</p>
          <p><strong>Surname:</strong> {{ userStore.surname }}</p>
          <p><strong>Email:</strong> {{ userStore.email }}</p>
          <p><strong>Age:</strong> {{ userStore.age }}</p>
        </div>
        <nav class="menu d-flex flex-column gap-2">
          <router-link to="/competitionsr" class="menu-item active-item"
            >competitions</router-link
          >
          <router-link to="/communityfr" class="menu-item"
            >Community</router-link
          >
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
            class="btn btn-link text-warning fw-bold p-0 logout-link"
          >
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
  name: "NcompetitionsR",
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
</style>

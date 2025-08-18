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
        class="competitions-content col-12 col-md-9 p-4 bg-black text-white"
      >
        <header
          class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 text-warning text-uppercase fw-bold"
        >
          <h2 class="title mb-2 mb-md-0">Competitions</h2>
          <router-link
            to="/"
            class="btn btn-link text-warning fw-bold p-0 logout-link"
            >Log Out</router-link
          >
        </header>

        <section>
          <h3
            class="d-flex text-white text-uppercase fw-bold mb-3 align-items-start"
          >
            My Results
          </h3>
          <div class="row g-4">
            <div class="col-md-8">
              <section>
                <div class="row g-4">
                  <div class="col-md-12">
                    <div class="card bg-white text-black">
                      <div class="card-body">
                        <div
                          v-for="competition in sortedCompetitions"
                          :key="competition.id"
                          class="d-flex justify-content-between align-items-start border-bottom py-2"
                        >
                          <div class="d-flex align-items-start">
                            <span class="me-2">
                              <i
                                :class="{
                                  'fa-solid fa-star': isPast(competition.date),
                                  'fa-regular fa-star': !isPast(
                                    competition.date
                                  ),
                                }"
                                style="color: #ffc107"
                              ></i>
                            </span>
                            <div>
                              <strong>{{ competition.name }}</strong
                              ><br />
                              <small>
                                Date: {{ formatDate(competition.date) }}<br />
                                Location: {{ competition.location }}
                              </small>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="sortedCompetitions.length === 0"
                          class="text-center py-4"
                        >
                          No competitions found.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div class="col-md-4">
              <div class="card bg-black text-center text-white py-4">
                <div class="fs-1">
                  <img
                    src="@/assets/trophy.png"
                    alt="trophy"
                    class="trophy-img"
                  />
                </div>
                <div class="mt-3">
                  <router-link
                    to="/ncompetitionsr"
                    class="btn btn-warning fw-bold"
                    >Create new competition</router-link
                  >
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
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  name: "CompetitionsR",
  data() {
    return { competitions: [] };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    sortedCompetitions() {
      return this.competitions.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
    },
  },
  methods: {
    async loadCompetitions() {
      try {
        const snapshot = await getDocs(collection(db, "competitions"));
        this.competitions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error loading competitions:", error);
      }
    },
    isPast(date) {
      const today = new Date();
      const compDate = new Date(date);
      return compDate < today;
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    async fetchCompetitions() {
      try {
        const auth = getAuth();
        const userId = auth.currentUser?.uid;
        if (!userId) {
          console.warn("User not logged in");
          return;
        }
        const competitionsCol = collection(db, "users", userId, "competitions");

        const snapshot = await getDocs(competitionsCol);
        this.competitions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching competitions:", error);
      }
    },
  },
  mounted() {
    this.loadCompetitions();
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

.trophy-img {
  width: 10em;
  height: auto;
  margin-bottom: 20px;
}

.edit {
  color: #ffc107;
}

.bg-darka {
  background-color: #000 !important;
}
</style>

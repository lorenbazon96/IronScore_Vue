<template>
  <div class="container-fluid">
    <div class="row min-vh-100">
      <aside class="col-12 col-md-3 sidebar bg-darka text-white p-3">
        <div class="logo">
          <img src="@/assets/logo-t.png" alt="IronScore Logo" />
        </div>
        <div class="user-info border-top pt-2 mb-3">
          <router-link to="/edit-r-account" class="edit"
            >Edit Account</router-link
          >
          <p><strong>Name:</strong> {{ userStore.name }}</p>
          <p><strong>Surname:</strong> {{ userStore.surname }}</p>
          <p><strong>Email:</strong> {{ userStore.email }}</p>
          <p><strong>Age:</strong> {{ userStore.age }}</p>
        </div>
        <nav class="menu">
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
        <header class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="text-warning fw-bold text-uppercase">Competitions</h2>
          <router-link
            to="/"
            class="btn btn-link text-warning fw-bold p-0 logout-link"
            >Log Out</router-link
          >
        </header>

        <section class="text-white text-start" v-if="loading">
          <p>Loading competition...</p>
        </section>

        <section class="text-white text-start" v-else-if="!competition">
          <h3 class="fw-bold text-uppercase mb-3">Competition not found</h3>
          <router-link
            class="btn btn-warning mt-2"
            :to="{ name: 'CompetitionsR' }"
            >Back to list</router-link
          >
        </section>
        <section class="text-white text-start" v-else>
          <h3 class="fw-bold text-uppercase mb-3">{{ competition.name }}</h3>
          <p class="mb-1">
            <strong>Date:</strong> {{ formatDate(competition.date) }}
          </p>
          <p class="mb-3">
            <strong>Location:</strong> {{ competition.location }}
          </p>

          <p v-if="competition.categories && competition.categories.length">
            <strong>Categories:</strong> {{ competition.categories.join(", ") }}
          </p>

          <ul v-if="infoLines.length" class="nice-list mt-3">
            <li v-for="(line, i) in infoLines" :key="i">{{ line }}</li>
          </ul>

          <ul v-if="competition.judging && competition.judging.length">
            <li v-for="(rule, idx) in competition.judging" :key="idx">
              {{ rule }}
            </li>
          </ul>
          <div
            class="mt-5 d-flex flex-column flex-md-row justify-content-start gap-3"
          >
            <div class="text-center">
              <button
                v-if="!isEventDayStrict(competition.date)"
                class="btn btn-secondary px-4"
                disabled
              >
                Start Judging
              </button>
              <div
                class="text-warning mt-1 small"
                v-if="!isEventDayStrict(competition.date)"
              >
                starting will be possible on the date of the event
              </div>

              <router-link
                v-else
                class="btn btn-warning text-black fw-bold px-4"
                :to="{ name: 'grade', query: { id: competition.id } }"
              >
                Start Judging
              </router-link>
            </div>
            <div class="text-center">
              <button
                v-if="!isAfterEvent(competition.date)"
                class="btn btn-secondary px-4"
                disabled
              >
                See result
              </button>
              <div
                class="text-warning mt-1 small"
                v-if="!isAfterEvent(competition.date)"
              >
                result will be possible after event
              </div>

              <router-link
                v-else
                class="btn btn-warning text-black fw-bold px-4"
                :to="{ name: 'resultsr', query: { id: competition.id } }"
              >
                See result
              </router-link>
            </div>
            <div class="text-center">
              <router-link class="btn btn-warning mt-2" to="/competitionsr">
                Back to list
              </router-link>
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
import { doc, getDoc } from "firebase/firestore";

export default {
  name: "CompetitionR",
  data() {
    return {
      competition: null,
      loading: true,
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    isEventDay() {
      if (!this.competition?.date) return false;
      const today = new Date();
      const d = new Date(this.competition.date);
      return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
      );
    },
    infoLines() {
      const t = this.competition?.info;
      if (!t) return [];

      if (t.includes("\n")) {
        return t
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      let withBreaks;
      try {
        withBreaks = t.replace(
          / ?(?=\p{Extended_Pictographic}|\p{Emoji_Presentation})/gu,
          "\n"
        );
      } catch {
        withBreaks = t.replace(
          / ?(?=[\u2190-\u21FF\u2300-\u23FF\u2460-\u24FF\u2500-\u259F\u25A0-\u25FF\u2600-\u27BF\u2900-\u297F\u2B00-\u2BFF\u{1F000}-\u{1FAFF}])/gu,
          "\n"
        );
      }

      return withBreaks
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    },
  },
  mounted() {
    const cid = this.$route.query.id;
    if (cid) this.loadCompetition(cid);
  },
  watch: {
    "$route.query.id"(newId) {
      if (newId) this.loadCompetition(newId);
    },
  },
  methods: {
    async loadCompetition(byId) {
      this.loading = true;
      try {
        const ref = doc(db, "competitions", byId);
        const snap = await getDoc(ref);
        this.competition = snap.exists()
          ? { id: snap.id, ...snap.data() }
          : null;
      } catch (e) {
        console.error("Error loading competition:", e);
        this.competition = null;
      } finally {
        this.loading = false;
      }
    },
    isPast(date) {
      const today = new Date();
      const compDate = new Date(date);
      return compDate < today;
    },
    formatDate(date) {
      if (!date) return "-";
      const d = new Date(date);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return d.toLocaleDateString(undefined, options);
    },
    isAfterEvent(date) {
      if (!date) return false;
      const endOfEvent = new Date(date);
      endOfEvent.setHours(23, 59, 59, 999);
      const now = new Date();
      return now > endOfEvent;
    },

    isEventDayStrict(date) {
      if (!date) return false;
      const d = new Date(date);
      const today = new Date();
      return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
      );
    },
  },
};
</script>

<style scoped>
.competitions-container {
  display: flex;
  height: 100vh;
  font-family: "Roboto", sans-serif;
  color: #fff;
  background: #000;
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
  gap: 20px;
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

.competitions-header {
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

.result-item:last-child {
  border-bottom: none;
}

.trophy-img {
  width: 10em;
  height: auto;
  margin-bottom: 20px;
}

.edit {
  color: #ffc107;
}

section ul {
  list-style-type: disc;
  padding-left: 20px;
}
section p,
section ul {
  font-size: 14px;
  color: #fff;
}

.bg-darka {
  background-color: #000 !important;
}
.nice-list {
  padding-left: 1.2rem;
  margin: 0;
}
.nice-list li {
  margin-bottom: 0.35rem;
  line-height: 1.6;
}
</style>

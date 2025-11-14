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
          <router-link to="/edit-account" class="edit d-block mb-2"
            >Edit Account</router-link
          >
          <p><strong>Name:</strong> {{ userStore.name }}</p>
          <p><strong>Surname:</strong> {{ userStore.surname }}</p>

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
            :to="{ name: 'Competitions' }"
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
                v-if="!canSeeResults"
                class="btn btn-secondary px-4"
                disabled
              >
                See result
              </button>

              <div class="mt-1 small" v-if="!canSeeResults">
                <span class="text-warning">
                  Waiting for all judges ({{ submittedJudgeIds.size }}/{{
                    expectedTotalGrades
                  }})
                </span>
              </div>

              <router-link
                v-else
                class="btn btn-warning text-black fw-bold px-4"
                :to="{ name: 'results', query: { id: competition.id } }"
              >
                See result
              </router-link>
            </div>

            <div class="text-center">
              <router-link class="btn btn-warning mt-2" to="/competitions">
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
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";

export default {
  name: "Competition",
  data() {
    return {
      competition: null,
      loading: true,
      stopGradesWatcher: null,
      expectedTotalGrades: 0,
      submittedJudgeIds: new Set(),
    };
  },
  computed: {
    userStore() {
      return useUserStore();
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

    canSeeResults() {
      return this.allJudgesSubmitted;
    },

    allJudgesSubmitted() {
      const c = this.competition || {};
      let expected =
        Array.isArray(c.judgeEmails) && c.judgeEmails.length
          ? c.judgeEmails.length
          : Array.isArray(c.judges) && c.judges.length
          ? c.judges.length
          : Array.isArray(c.allowedJudges) && c.allowedJudges.length
          ? c.allowedJudges.length
          : Array.isArray(c.judgesNames) && c.judgesNames.length
          ? c.judgesNames.length
          : Array.isArray(c.referees) && c.referees.length
          ? c.referees.length
          : 0;

      if (!expected) expected = this.submittedJudgeIds.size;

      return expected > 0 && this.submittedJudgeIds.size >= expected;
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
        if (this.competition) this.afterCompetitionLoaded();
      } catch (e) {
        console.error("Error loading competition:", e);
        this.competition = null;
      } finally {
        this.loading = false;
      }
    },

    formatDate(date) {
      if (!date) return "-";
      const d = new Date(date);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return d.toLocaleDateString(undefined, options);
    },

    watchGrades() {
      if (this.stopGradesWatcher) {
        this.stopGradesWatcher();
        this.stopGradesWatcher = null;
      }
      if (!this.competition?.id) return;

      const gradesCol = collection(
        db,
        "competitions",
        this.competition.id,
        "grades"
      );
      this.stopGradesWatcher = onSnapshot(
        gradesCol,
        (snap) => {
          const judgeIds = new Set();
          snap.forEach((d) => {
            const data = d.data() || {};
            let jid = (data.judgeId || "").toString().trim();
            if (!jid && typeof d.id === "string" && d.id.includes("_")) {
              jid = d.id.split("_")[0];
            }
            if (jid) judgeIds.add(jid);
          });

          this.submittedJudgeIds = judgeIds;

          const c = this.competition || {};
          const expectedJudges =
            Array.isArray(c.judgeEmails) && c.judgeEmails.length
              ? c.judgeEmails.length
              : Array.isArray(c.judges) && c.judges.length
              ? c.judges.length
              : Array.isArray(c.allowedJudges) && c.allowedJudges.length
              ? c.allowedJudges.length
              : Array.isArray(c.judgesNames) && c.judgesNames.length
              ? c.judgesNames.length
              : Array.isArray(c.referees) && c.referees.length
              ? c.referees.length
              : judgeIds.size;

          this.expectedTotalGrades = expectedJudges;
        },
        (err) => console.error("[Competition] grades onSnapshot error:", err)
      );
    },
    afterCompetitionLoaded() {
      this.watchGrades();
    },
  },
  beforeUnmount() {
    if (this.stopGradesWatcher) {
      this.stopGradesWatcher();
      this.stopGradesWatcher = null;
    }
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

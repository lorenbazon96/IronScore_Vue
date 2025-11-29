<template>
  <div class="container-fluid">
    <div class="row min-vh-100">
      <aside class="col-12 col-md-3 sidebar bg-darka text-white p-3">
        <div class="logo">
          <img src="@/assets/logo-t.png" alt="IronScore Logo" />
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
        <nav class="menu">
          <router-link to="/dashboard" class="menu-item">Progress</router-link>
          <router-link to="/competitions" class="menu-item active-item"
            >competitions</router-link
          >
          <router-link to="/community" class="menu-item">Community</router-link>
          <router-link to="/timer" class="menu-item">Timer</router-link>
          <router-link to="/trainings" class="menu-item">Trainings</router-link>
        </nav>
      </aside>

      <main class="training-content col-12 col-md-9 p-4 bg-black text-white">
        <header class="training-header trainings-header">
          <h2 class="trainings-title">Final Results</h2>
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

        <section v-if="loading" class="text-white">Loading results…</section>

        <section v-else>
          <h4 class="text-white text-uppercase fw-bold mb-4">
            {{ competition?.name || "Competition" }}
          </h4>

          <div class="bg-white text-black p-4 rounded">
            <h5 class="text-uppercase fw-bold mb-3">Competitor Results</h5>

            <div v-if="finalResults.length === 0" class="text-muted">
              No grades yet.
            </div>

            <table v-else class="table table-bordered table-striped">
              <thead class="table-dark">
                <tr>
                  <th>#</th>
                  <th>Category</th>
                  <th>Grades</th>
                  <th>Average Grade</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in finalResults" :key="row.index">
                  <td>Competitor {{ row.index + 1 }}</td>
                  <td>{{ row.category || "-" }}</td>
                  <td>
                    <span v-if="row.grades.length">{{
                      row.grades.join(", ")
                    }}</span>
                    <span v-else>-</span>
                  </td>
                  <td>
                    <span v-if="row.grades.length">{{
                      row.avg.toFixed(2)
                    }}</span>
                    <span v-else>-</span>
                  </td>
                </tr>
              </tbody>
            </table>
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
  doc,
  getDoc,
  collection,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

export default {
  name: "Results",
  data() {
    return {
      competitionId: null,
      competition: null,
      loading: true,
      finalResults: [],
      stopGradesWatcher: null,
    };
  },
  methods: {
    average(list) {
      if (!Array.isArray(list) || list.length === 0) return 0;
      const sum = list.reduce((a, b) => a + b, 0);
      return sum / list.length;
    },
    pickDominantCategory(categoryCounts) {
      let best = null;
      let bestCnt = -1;
      for (const [cat, cnt] of categoryCounts.entries()) {
        if (cnt > bestCnt) {
          best = cat;
          bestCnt = cnt;
        }
      }
      return best;
    },
    async loadCompetition() {
      this.loading = true;
      try {
        this.competitionId = this.$route.query.id || null;
        if (!this.competitionId) {
          this.competition = null;
          this.finalResults = [];
          return;
        }

        const cref = doc(db, "competitions", this.competitionId);
        const csnap = await getDoc(cref);
        this.competition = csnap.exists()
          ? { id: csnap.id, ...csnap.data() }
          : null;

        this.watchGrades();
      } catch (e) {
        console.error("[ResultsR] loadCompetition error:", e);
        this.competition = null;
        this.finalResults = [];
      } finally {
        this.loading = false;
      }
    },

    async readAndAggregateGradesOnce() {
      const gradesCol = collection(
        db,
        "competitions",
        this.competitionId,
        "grades"
      );
      const snap = await getDocs(gradesCol);
      this.aggregateGrades(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    },

    watchGrades() {
      if (this.stopGradesWatcher) {
        this.stopGradesWatcher();
        this.stopGradesWatcher = null;
      }
      const gradesCol = collection(
        db,
        "competitions",
        this.competitionId,
        "grades"
      );
      this.stopGradesWatcher = onSnapshot(
        gradesCol,
        (snap) => {
          const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          this.aggregateGrades(rows);
        },
        (err) => {
          console.error("[ResultsR] grades onSnapshot error:", err);
        }
      );
    },

    aggregateGrades(rows) {
      const byIndex = new Map();

      for (const r of rows) {
        const idx = Number(r.competitorIndex);
        const grade = Number(r.grade);
        const cat = (r.category || "").toString();

        if (Number.isNaN(idx) || Number.isNaN(grade)) continue;

        if (!byIndex.has(idx)) {
          byIndex.set(idx, { grades: [], categoryCounts: new Map() });
        }
        const slot = byIndex.get(idx);
        slot.grades.push(grade);

        if (cat) {
          const c = slot.categoryCounts.get(cat) || 0;
          slot.categoryCounts.set(cat, c + 1);
        }
      }

      const count =
        typeof this.competition?.competitorsCount === "number" &&
        this.competition.competitorsCount > 0
          ? this.competition.competitorsCount
          : Math.max(0, ...Array.from(byIndex.keys()).map((k) => k + 1));

      const out = [];
      const total = count || byIndex.size;

      for (let i = 0; i < total; i++) {
        const slot = byIndex.get(i);
        if (!slot) {
          out.push({ index: i, category: "", grades: [], avg: 0 });
          continue;
        }
        const category = this.pickDominantCategory(slot.categoryCounts) || "";
        const avg = this.average(slot.grades);
        out.push({
          index: i,
          category,
          grades: slot.grades.sort((a, b) => b - a),
          avg,
        });
      }

      this.finalResults = out;
    },
  },
  computed: {
    userStore() {
      return useUserStore();
    },
  },
  mounted() {
    this.loadCompetition();
  },
  watch: {
    "$route.query.id"(n) {
      if (n) this.loadCompetition();
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
  gap: 10px;
}

.menu-item {
  color: #ffffff;
  font-weight: bold;
  text-decoration: none;
  font-size: 20px;
  text-transform: uppercase;
}
.training-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.training-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffc107;
  text-transform: uppercase;
}

.trainings-title {
  font-size: 2rem;
  font-weight: bold;
  color: #ffc107;
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

.active-item {
  color: #ffc107 !important;
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

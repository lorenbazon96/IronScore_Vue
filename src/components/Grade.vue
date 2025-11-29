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
              to="/edit-r-account"
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
          <router-link to="/competitionsr" class="menu-item active-item"
            >competitions</router-link
          >
          <router-link to="/communityfr" class="menu-item"
            >Community</router-link
          >
        </nav>
      </aside>
      <main class="training-content col-12 col-md-9 p-4 bg-black text-white">
        <header class="training-header trainings-header">
          <h2 class="title trainings-title">Competitions</h2>
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
        <h4 class="text-white text-uppercase fw-bold mb-2">
          {{ competition?.name || "Competition" }}
        </h4>
        <p v-if="!canJudgeToday" class="text-warning mb-4">
          Judging is available only to authorized judges on the event day.
        </p>
        <div class="d-flex gap-4 flex-wrap">
          <div
            class="bg-white p-4 rounded text-black"
            style="
              min-width: 350px;
              max-height: 500px;
              overflow-y: auto;
              flex: 1;
            "
          >
            <h5 class="text-uppercase fw-bold border-bottom pb-2">
              Competitors
            </h5>
            <div
              v-for="(competitor, index) in competitors"
              :key="index"
              class="mb-4"
            >
              <div>
                <strong>Competitor {{ index + 1 }}</strong>
              </div>
              <div class="d-flex align-items-center my-2 gap-2">
                <label class="me-1">Grade:</label>
                <input
                  v-model="competitor.grade"
                  type="number"
                  min="1"
                  class="form-control form-control-sm"
                  style="width: 80px"
                  :disabled="!canJudgeToday"
                />
              </div>
              <div class="d-flex align-items-center gap-2">
                <label>Category:</label>
                <select
                  v-model="competitor.category"
                  class="form-select form-select-sm"
                  style="flex: 1"
                  :disabled="!canJudgeToday"
                >
                  <option disabled value="">Choose category</option>
                  <option v-for="(cat, i) in categories" :key="i" :value="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>
              <button
                class="btn btn-warning btn-sm mt-2"
                @click="addGrade(index)"
                :disabled="!canJudgeToday"
              >
                Add
              </button>
            </div>
          </div>
          <div
            class="bg-dark p-4 text-white rounded"
            style="min-width: 350px; flex: 1"
          >
            <h5 class="text-uppercase fw-bold mb-3">Your Grades</h5>
            <div
              v-for="(grade, idx) in grades"
              :key="idx"
              class="d-flex justify-content-between align-items-center border-bottom py-2"
            >
              <div>
                <strong>Competitor {{ grade.index + 1 }}</strong
                ><br />
                <small>{{ grade.category }}</small>
              </div>
              <div>
                <span class="me-3">{{ grade.grade }}</span>
                <button
                  class="btn btn-link text-danger p-0"
                  @click="removeGrade(idx)"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 text-end">
          <button
            class="btn btn-warning fw-bold px-4 py-2"
            :disabled="saving || grades.length === 0 || !canJudgeToday"
            @click="finishAndSave"
          >
            <span v-if="!saving">Finish and save grades</span>
            <span v-else>Saving…</span>
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase";
import {
  doc,
  getDoc,
  collection,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export default {
  name: "Grade",
  data() {
    return {
      competitionId: null,
      competition: null,
      categories: [],
      fallbackCount: 50,
      competitors: [],
      grades: [],
      loading: true,
      saving: false,
      basePath: null,
    };
  },

  computed: {
    userStore() {
      return useUserStore();
    },
    isJudgeAllowed() {
      const comp = this.competition;
      if (!comp) return false;

      const fullUserName = this._normFullName(
        this.userStore?.name,
        this.userStore?.surname
      );
      const userEmail = (this.userStore?.email || "").trim().toLowerCase();

      const judgeNameStrings = new Set();
      const pushName = (n) => {
        const nn = this._normString(n);
        if (nn) judgeNameStrings.add(nn);
      };

      const candidates =
        comp?.judges ??
        comp?.allowedJudges ??
        comp?.judgesNames ??
        comp?.referees ??
        [];

      if (Array.isArray(candidates)) {
        for (const item of candidates) {
          if (typeof item === "string") {
            pushName(item);
          } else if (item && typeof item === "object") {
            if (item.fullName) pushName(item.fullName);
            else pushName(this._composeName(item.name, item.surname));
          }
        }
      }

      const judgeEmails = Array.isArray(comp?.judgeEmails)
        ? comp.judgeEmails
        : [];
      const emailAllowed = judgeEmails
        .map((e) => (e || "").toString().trim().toLowerCase())
        .includes(userEmail);

      if (emailAllowed) return true;
      if (fullUserName && judgeNameStrings.has(fullUserName)) return true;
      return false;
    },
    canJudgeToday() {
      return (
        this.isJudgeAllowed && this.isEventDayStrict(this.competition?.date)
      );
    },
  },

  methods: {
    async loadCompetition() {
      this.loading = true;
      try {
        this.competitionId = this.$route.query.id || null;
        if (!this.competitionId) {
          console.warn("Grade: missing ?id in URL");
          this.categories = [];
          this.competitors = Array.from({ length: this.fallbackCount }, () => ({
            grade: "",
            category: "",
          }));
          this.basePath = null;
          return;
        }

        let ref = doc(db, "competitions", this.competitionId);
        let snap = await getDoc(ref);
        let basePath = ["competitions", this.competitionId];

        if (!snap.exists()) {
          const { getAuth } = await import("firebase/auth");
          const uid = getAuth().currentUser?.uid;
          if (uid) {
            ref = doc(db, "users", uid, "competitions", this.competitionId);
            const subSnap = await getDoc(ref);
            if (subSnap.exists()) {
              snap = subSnap;
              basePath = ["users", uid, "competitions", this.competitionId];
            }
          }
        }

        console.log(
          "[Grade] using basePath =",
          basePath.join("/"),
          "exists =",
          snap.exists()
        );

        this.basePath = basePath;
        this.competition = snap.exists()
          ? { id: snap.id, ...snap.data() }
          : null;

        this.categories = Array.isArray(this.competition?.categories)
          ? this.competition.categories
          : [];

        const count =
          typeof this.competition?.competitorsCount === "number" &&
          this.competition.competitorsCount > 0
            ? this.competition.competitorsCount
            : this.fallbackCount;

        this.competitors = Array.from({ length: count }, () => ({
          grade: "",
          category: "",
        }));
      } catch (e) {
        console.error("Error loading competition:", e);
        this.categories = [];
        this.competitors = Array.from({ length: this.fallbackCount }, () => ({
          grade: "",
          category: "",
        }));
        this.basePath = null;
      } finally {
        this.loading = false;
      }
    },

    addGrade(index) {
      const comp = this.competitors[index];
      const gradeNum = Number(comp.grade);
      const category = (comp.category || "").toString().trim();

      if (!gradeNum || !category) {
        alert("Please fill in both grade (number) and category.");
        return;
      }

      // Allow multiple categories for same competitor
      // Check if this exact combination (index + category) already exists
      const existingIdx = this.grades.findIndex(
        (g) => g.index === index && g.category === category
      );

      const payload = { index, grade: gradeNum, category };
      if (existingIdx !== -1) {
        // Update existing grade for this competitor+category combination
        this.grades.splice(existingIdx, 1, payload);
      } else {
        // Add new grade (allows same competitor with different category)
        this.grades.push(payload);
      }

      this.competitors[index].grade = "";
      this.competitors[index].category = "";
    },

    removeGrade(idx) {
      this.grades.splice(idx, 1);
    },

    async finishAndSave() {
      const auth = getAuth();
      const uid = auth.currentUser?.uid;
      if (!uid) {
        alert("You must be logged in to save grades.");
        return;
      }
      if (!Array.isArray(this.grades) || this.grades.length === 0) {
        alert("Add at least one grade.");
        return;
      }

      const compId =
        (this.basePath && this.basePath[1]) ||
        this.competition?.id ||
        this.competitionId;
      if (!compId) {
        alert("Competition id not resolved.");
        return;
      }

      const sanitized = this.grades
        .map((g) => ({
          index: Number(g.index),
          grade: Number(g.grade),
          category: (g.category ?? "").toString().trim(),
        }))
        .filter(
          (g) =>
            !Number.isNaN(g.index) &&
            !Number.isNaN(g.grade) &&
            g.grade > 0 &&
            g.category
        );

      this.saving = true;
      try {
        const gradesCol = collection(db, "competitions", compId, "grades");

        await Promise.all(
          sanitized.map((g) => {
            // Changed document ID to include category - allows multiple categories per competitor
            const docId = `${uid}_${g.index}_${g.category.replace(
              /\s+/g,
              "_"
            )}`;
            return setDoc(
              doc(gradesCol, docId),
              {
                judgeId: uid,
                competitionId: compId,
                competitorIndex: g.index,
                category: g.category,
                grade: g.grade,
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          })
        );

        alert("Grades saved successfully.");
      } catch (e) {
        console.error("[SAVE] Firestore error:", e);
        alert(`Failed to save grades: ${e?.message || e}`);
      } finally {
        this.saving = false;
      }
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

    _composeName(name, surname) {
      const n = (name || "").toString().trim();
      const s = (surname || "").toString().trim();
      return `${n} ${s}`.trim();
    },
    _normFullName(name, surname) {
      return this._normString(this._composeName(name, surname));
    },
    _normString(str) {
      const s = (str || "").toString().trim().toLowerCase();
      const squashed = s.replace(/\s+/g, " ");
      try {
        return squashed.normalize("NFD").replace(/\p{Diacritic}/gu, "");
      } catch {
        return squashed
          .replace(/[čć]/g, "c")
          .replace(/[đ]/g, "d")
          .replace(/[š]/g, "s")
          .replace(/[ž]/g, "z");
      }
    },
  },

  mounted() {
    console.log("[Grade] route.query.id =", this.$route.query.id);
    this.loadCompetition().then(() => {
      if (!this.canJudgeToday) {
        alert("You are not allowed to judge this competition today.");
        this.$router.replace({
          name: "CompetitionR",
          query: { id: this.$route.query.id },
        });
      }
    });
  },

  watch: {
    "$route.query.id"(n) {
      console.log("[Grade] query id changed ->", n);
      if (n) this.loadCompetition();
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
.training-content {
  flex: 1;
  padding: 15px;
  background: #000;
  overflow-y: auto;
}
.training-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  color: #ffc107;
  text-transform: uppercase;
  font-weight: 900;
}
.title {
  font-weight: bold;
}
.trainings-header {
  color: #fff;
}
.trainings-title {
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #ffc107;
}
.training-plan {
  background-color: #2b2b2b;
  border-radius: 20px;
  padding: 15px;
}
.custom-card {
  background-color: rgb(255, 255, 255) !important;
  border-radius: 20px;
  padding: 15px;
  color: #000000 !important;
}
.custom-card-finish {
  background-color: rgb(40, 40, 40) !important;
  border-radius: 20px;
  padding: 15px;
  color: #000000 !important;
}
.section-title {
  font-weight: bold;
  font-size: 20px;
  color: #000000 !important;
  margin-bottom: 10px;
  text-transform: uppercase;
}
.custom-card {
  background-color: #2b2b2b;
  border-radius: 15px;
}
.section-title-finish {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 15px;
  text-transform: uppercase;
}
.list-group-item {
  font-size: 15px;
  padding: 10px;
  border: none;
}
.btn-warning {
  background-color: #ffc107;
  color: #000;
  border: none;
  border-radius: 6px;
  font-weight: bold;
}
.btn-warning:hover {
  background-color: #ffcd39;
}
.logout-link {
  color: #ffc107 !important;
  font-size: 14px;
  text-transform: uppercase;
  text-decoration: none;
}
.trainings-header {
  color: #fff;
}
.exercise-name {
  font-weight: bold;
  text-transform: uppercase;
  color: black;
  display: block;
  text-align: left;
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

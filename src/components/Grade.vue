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

      <main class="training-content col-12 col-md-9 p-4 bg-black text-white">
        <header class="training-header trainings-header">
          <h2 class="title trainings-title">Competitions</h2>
          <router-link
            to="/"
            class="btn btn-link text-warning fw-bold p-0 logout-link"
          >
            Log Out
          </router-link>
        </header>

        <h4 class="text-white text-uppercase fw-bold mb-4">
          {{ competition?.name || "Competition" }}
        </h4>
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
                />
              </div>
              <div class="d-flex align-items-center gap-2">
                <label>Category:</label>
                <select
                  v-model="competitor.category"
                  class="form-select form-select-sm"
                  style="flex: 1"
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
            :disabled="saving || grades.length === 0"
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
      fallbackCount: 7,
      competitors: [],
      grades: [],
      loading: true,
      saving: false,
      basePath: null,
    };
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
      if (!gradeNum || !comp.category) {
        alert("Please fill in both grade (number) and category.");
        return;
      }

      const existingIdx = this.grades.findIndex((g) => g.index === index);
      const payload = { index, grade: gradeNum, category: comp.category };
      if (existingIdx !== -1) this.grades.splice(existingIdx, 1, payload);
      else this.grades.push(payload);

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
        this?.competition?.id ||
        this.competitionId;
      if (!compId) {
        alert("Competition id not resolved.");
        return;
      }

      const sanitized = this.grades.map((g) => ({
        index: Number(g.index),
        grade: Number(g.grade),
        category: (g.category ?? "").toString().trim(),
      }));
      const invalid = sanitized.filter(
        (g) =>
          Number.isNaN(g.index) ||
          Number.isNaN(g.grade) ||
          g.grade <= 0 ||
          !g.category
      );
      if (invalid.length) {
        alert("Some grades are invalid. Check numbers and categories.");
        return;
      }

      this.saving = true;
      try {
        const gradesCol = collection(db, "competitions", compId, "grades");

        await Promise.all(
          sanitized.map((g) =>
            setDoc(
              doc(gradesCol, `${uid}_${g.index}`),
              {
                judgeId: uid,
                competitionId: compId,
                competitorIndex: g.index,
                category: g.category,
                grade: g.grade,
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            )
          )
        );

        alert("Grades saved successfully.");
      } catch (e) {
        console.error("[SAVE] Firestore error:", e);
        alert(`Failed to save grades: ${e?.message || e}`);
      } finally {
        this.saving = false;
      }
    },
  },
  computed: {
    userStore() {
      return useUserStore();
    },
  },
  mounted() {
    console.log("[Grade] route.query.id =", this.$route.query.id);
    this.loadCompetition();
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
</style>

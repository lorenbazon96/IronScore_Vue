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
          <router-link to="/competitionsr" class="menu-item active-item">
            Competitions
          </router-link>
          <router-link to="/communityfr" class="menu-item">
            Community
          </router-link>
        </nav>
      </aside>

      <main class="competitions-content col-12 col-md-9 bg-black text-white">
        <header
          class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3"
        >
          <h2 class="title text-warning text-uppercase fw-bold mb-2 mb-md-0">
            Competitions
          </h2>

          <router-link
            to="/"
            class="btn btn-link text-warning fw-bold p-0 logout-link d-flex align-items-center text-uppercase"
          >
            <img
              src="@/assets/logout.png"
              alt="Logout"
              class="logout-icon me-2"
            />
            Log Out
          </router-link>
        </header>

        <div class="detail-scroll">
          <section class="text-white text-start" v-if="loading">
            <p>Loading competition...</p>
          </section>

          <section class="text-white text-start" v-else-if="!competition">
            <div class="detail-inner mx-auto">
              <h3 class="fw-bold text-uppercase mb-3">Competition not found</h3>
              <router-link
                class="btn btn-warning mt-2"
                :to="{ name: 'CompetitionsR' }"
              >
                Back to list
              </router-link>
            </div>
          </section>

          <section class="text-white text-start" v-else>
            <div class="detail-inner mx-auto">
              <div class="card competition-header-card mb-3">
                <div
                  class="card-body d-flex flex-column flex-md-row justify-content-between gap-3"
                >
                  <div>
                    <div class="breadcrumb-small mb-1">
                      <router-link
                        to="/competitionsr"
                        class="text-muted text-decoration-none small"
                      >
                        Competitions
                      </router-link>
                      <span class="text-muted small"> / </span>
                      <span class="text-warning small">Details</span>
                    </div>

                    <h3 class="fw-bold text-uppercase mb-1">
                      {{ competition.name }}
                    </h3>

                    <div class="text-muted small mb-2">
                      <i class="fa-regular fa-calendar me-1"></i>
                      {{ formatDate(competition.date) }}
                      <span v-if="competition.location">
                        &nbsp;•&nbsp;
                        <i class="fa-solid fa-location-dot me-1"></i>
                        {{ competition.location }}
                      </span>
                    </div>

                    <div
                      v-if="
                        competition.categories && competition.categories.length
                      "
                      class="d-flex flex-wrap gap-1 mt-1"
                    >
                      <span
                        v-for="cat in competition.categories"
                        :key="cat"
                        class="badge-chip small-badge"
                      >
                        {{ cat }}
                      </span>
                    </div>
                  </div>

                  <div
                    class="text-md-end d-flex flex-column justify-content-between"
                  >
                    <div>
                      <span
                        class="status-pill"
                        :class="
                          isPast(competition.date)
                            ? 'status-past'
                            : 'status-upcoming'
                        "
                      >
                        <i
                          v-if="isPast(competition.date)"
                          class="fa-solid fa-calendar-check me-1"
                        ></i>
                        <i v-else class="fa-regular fa-clock me-1"></i>
                        {{ isPast(competition.date) ? "Finished" : "Upcoming" }}
                      </span>
                    </div>

                    <div class="mt-2 mt-md-0">
                      <router-link
                        to="/competitionsr"
                        class="btn btn-outline-light btn-sm"
                      >
                        Back to list
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card bg-dark text-white details-card mb-3">
                <div class="card-body">
                  <h5 class="mb-3 text-uppercase text-warning">Overview</h5>

                  <ul v-if="infoLines.length" class="nice-list mb-3">
                    <li v-for="(line, i) in infoLines" :key="'info-' + i">
                      {{ line }}
                    </li>
                  </ul>

                  <div
                    v-if="competition.judging && competition.judging.length"
                    class="mt-3"
                  >
                    <h6 class="text-uppercase text-warning mb-2">
                      Judging criteria
                    </h6>
                    <ul class="nice-list">
                      <li
                        v-for="(rule, idx) in competition.judging"
                        :key="'judging-' + idx"
                      >
                        {{ rule }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="card bg-dark text-white judge-status-card mb-3">
                <div
                  class="card-body d-flex flex-column flex-lg-row justify-content-between gap-3"
                >
                  <div class="flex-grow-1">
                    <h6 class="mb-2 text-uppercase text-warning">Judging</h6>

                    <div class="mb-2">
                      <button
                        v-if="
                          !(
                            isEventDayStrict(competition.date) &&
                            isJudgeAllowed &&
                            !mySubmitted
                          )
                        "
                        class="btn btn-secondary btn-sm px-4"
                        disabled
                      >
                        Start judging
                      </button>

                      <router-link
                        v-else
                        class="btn btn-warning text-black fw-bold btn-sm px-4"
                        :to="{ name: 'grade', query: { id: competition.id } }"
                      >
                        Start judging
                      </router-link>
                    </div>

                    <div class="small">
                      <div
                        class="text-warning"
                        v-if="!isEventDayStrict(competition.date)"
                      >
                        Starting will be possible on the date of the event.
                      </div>
                      <div class="text-danger" v-else-if="!isReferee">
                        Your account is not a referee.
                      </div>
                      <div class="text-danger" v-else-if="!isOnJudgesList">
                        Your account is not on the judges list for this
                        competition.
                      </div>
                      <div class="text-info" v-else-if="mySubmitted">
                        You have already submitted your grades.
                      </div>
                    </div>
                  </div>

                  <div class="flex-grow-1">
                    <h6 class="mb-2 text-uppercase text-warning">Results</h6>

                    <div class="mb-2">
                      <button
                        v-if="!canSeeResults"
                        class="btn btn-secondary btn-sm px-4"
                        disabled
                      >
                        See result
                      </button>

                      <router-link
                        v-else
                        class="btn btn-warning text-black fw-bold btn-sm px-4"
                        :to="{
                          name: 'resultsr',
                          query: { id: competition.id },
                        }"
                      >
                        See result
                      </router-link>
                    </div>

                    <div class="small">
                      <p class="mb-1">
                        Waiting for all judges ({{ submittedJudgeIds.size }}/{{
                          expectedTotalGrades
                        }})
                      </p>
                      <div class="progress small-progress">
                        <div
                          class="progress-bar bg-warning"
                          role="progressbar"
                          :style="{
                            width:
                              expectedTotalGrades > 0
                                ? (submittedJudgeIds.size /
                                    expectedTotalGrades) *
                                    100 +
                                  '%'
                                : '0%',
                          }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user";
import { db } from "@/firebase";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  name: "CompetitionR",
  data() {
    return {
      competition: null,
      loading: true,
      stopGradesWatcher: null,
      expectedTotalGrades: 0,
      userRole: null,
      submittedJudgeIds: new Set(),
      mySubmitted: false,
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
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean);
      }

      return [t.trim()];
    },

    canSeeResults() {
      return this.allJudgesSubmitted;
    },

    isReferee() {
      const fromStore = (
        this.userStore?.role ||
        this.userStore?.type ||
        ""
      ).toLowerCase();
      const eff = fromStore || this.userRole || "";
      return eff === "referee";
    },

    isOnJudgesList() {
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
          if (typeof item === "string") pushName(item);
          else if (item && typeof item === "object") {
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

    isJudgeAllowed() {
      return this.isReferee && this.isOnJudgesList;
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
    this.loadUserRole();
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

    isPast(date) {
      if (!date) return false;
      const today = new Date();
      const compDate = new Date(date);
      return compDate < today;
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
      if (!n && !s) return "";
      return `${n} ${s}`.trim();
    },

    _normFullName(name, surname) {
      return this._normString(this._composeName(name, surname));
    },

    _normString(str) {
      const s = (str || "").toString().trim().toLowerCase();
      if (!s) return "";
      const squashed = s.replace(/\s+/g, " ");
      try {
        return squashed.normalize("NFD").replace(/\p{Diacritic}/gu, "");
      } catch {
        return squashed
          .replace(/[čćČĆ]/g, "c")
          .replace(/[đĐ]/g, "d")
          .replace(/[šŠ]/g, "s")
          .replace(/[žŽ]/g, "z");
      }
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

          const finalUid = getAuth().currentUser?.uid || null;
          this.mySubmitted = finalUid ? judgeIds.has(finalUid) : false;

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
        (err) => console.error("[CompetitionR] grades onSnapshot error:", err)
      );
    },

    afterCompetitionLoaded() {
      this.watchGrades();
    },

    async loadUserRole() {
      try {
        const uid = getAuth().currentUser?.uid;
        if (!uid) return;
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const data = userDoc.data() || {};
          this.userRole = (data.role || data.type || "")
            .toString()
            .toLowerCase();
        }
      } catch (e) {
        console.warn("[CompetitionR] Could not load user role:", e);
      }
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

.competitions-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.title {
  font-weight: bold;
}

.logout-link {
  color: #ffc107 !important;
  font-size: 13px;
  text-decoration: none;
}

.logout-icon {
  width: 18px;
  height: 18px;
}

.detail-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
  min-height: 0;
}

.detail-inner {
  max-width: 960px;
}

.container-fluid {
  height: 100vh;
  overflow: hidden;
  padding: 0;
}

.row.min-vh-100 {
  height: 100%;
  overflow: hidden;
}

aside {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.container-fluid,
.row,
.competitions-content {
  overflow-x: hidden;
}

.competition-header-card {
  border-radius: 12px;
  border: 1px solid #333;
}

.breadcrumb-small {
  font-size: 11px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  text-transform: uppercase;
}

.status-upcoming {
  background-color: rgba(40, 167, 69, 0.15);
  color: #28a745;
}

.status-past {
  background-color: rgba(255, 255, 255, 0.08);
  color: #aaa;
}

.nice-list {
  padding-left: 1.2rem;
  margin: 0;
}

.nice-list li {
  margin-bottom: 0.35rem;
  line-height: 1.6;
  font-size: 14px;
}

.badge-chip {
  background-color: #f5f5f5;
  border-radius: 999px;
  padding: 2px 8px;
  display: inline-flex;
  align-items: center;
  color: #333;
}

.small-badge {
  font-size: 11px;
  padding: 1px 6px;
}

.judge-status-card {
  border-radius: 12px;
  border: 1px solid #333;
}

.small-progress {
  height: 6px;
  border-radius: 999px;
  background-color: #222;
}

.small-progress .progress-bar {
  border-radius: 999px;
}
</style>

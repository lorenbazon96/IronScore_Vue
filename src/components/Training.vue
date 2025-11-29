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
          <router-link to="/competitions" class="menu-item">
            Competitions
          </router-link>
          <router-link to="/community" class="menu-item">Community</router-link>
          <router-link to="/timer" class="menu-item">Timer</router-link>
          <router-link to="/trainings" class="menu-item active-item">
            Trainings
          </router-link>
        </nav>
      </aside>

      <main class="col-12 col-md-9 trainings-content bg-black text-white">
        <header
          class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4"
        >
          <h2 class="title text-warning fw-bold text-uppercase mb-2 mb-md-0">
            Trainings
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

        <div
          class="d-flex gap-4 align-items-start mb-5 flex-wrap trainings-top-row"
        >
          <div class="new-training-actions d-flex flex-column gap-3">
            <router-link
              to="/new-training-daily"
              class="btn btn-warning fw-bold text-start"
            >
              Create new training (Daily)
            </router-link>
            <router-link
              to="/new-training-weekly"
              class="btn btn-warning fw-bold text-start"
            >
              Create new training (Weekly)
            </router-link>
          </div>

          <section class="training-plan custom-card flex-grow-1">
            <h4 class="section-title d-flex align-items-center">
              {{
                selectedTraining ? selectedTraining.name : "Training preview"
              }}
              <span
                v-if="selectedTraining"
                class="badge bg-warning text-dark text-uppercase ms-2"
              >
                {{ selectedTraining.type }}
              </span>
            </h4>

            <p v-if="!selectedTraining" class="text-muted mb-0">
              Select a training from
              <strong>MY TRAININGS LIST</strong> to preview it here.
            </p>

            <div v-else class="d-flex gap-3 mt-3 flex-wrap">
              <div class="plan-selector">
                <div class="fw-bold text-uppercase small text-secondary mb-1">
                  {{
                    selectedIsWeekly
                      ? "Days"
                      : dailyHasDays
                      ? "Days & Groups"
                      : "Groups"
                  }}
                </div>

                <div v-if="selectedIsWeekly" class="d-flexy flex-wrap gap-2">
                  <button
                    v-for="day in selectedDays"
                    :key="'w-' + day"
                    class="btn btn-sm day-chip"
                    :class="
                      currentDay === day ? 'btn-warning' : 'btn-outline-warning'
                    "
                    @click="selectDay(day)"
                  >
                    {{ day }}
                  </button>
                </div>

                <div v-else-if="dailyHasDays">
                  <div class="mb-2 d-flexy flex-wrap gap-2">
                    <button
                      v-for="day in selectedDays"
                      :key="'d-' + day"
                      class="btn btn-sm day-chip"
                      :class="
                        currentDay === day
                          ? 'btn-warning'
                          : 'btn-outline-warning'
                      "
                      @click="selectDay(day)"
                    >
                      {{ day }}
                    </button>
                  </div>
                  <div class="d-flexy flex-wrap gap-2">
                    <button
                      v-for="g in groupsForDay(currentDay)"
                      :key="'dg-' + currentDay + '-' + g"
                      class="btn btn-sm group-chip"
                      :class="
                        currentGroup === g
                          ? 'btn-warning'
                          : 'btn-outline-warning'
                      "
                      @click="selectGroup(g)"
                    >
                      {{ g }}
                    </button>
                  </div>
                </div>

                <div v-else>
                  <div class="d-flexy flex-wrap gap-2">
                    <button
                      v-for="g in groupsForDay(null)"
                      :key="'g-' + g"
                      class="btn btn-sm group-chip"
                      :class="
                        currentGroup === g
                          ? 'btn-warning'
                          : 'btn-outline-warning'
                      "
                      @click="selectGroup(g)"
                    >
                      {{ g }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex-grow-1">
                <div class="table-responsive">
                  <table class="table custom-table text-white mb-0">
                    <thead>
                      <tr>
                        <th class="hr">Exercise</th>
                        <th class="hr col-sets">Sets</th>
                        <th class="hr col-reps">Reps</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="activeExercises.length === 0">
                        <td colspan="3" class="text-center text-muted">
                          No exercises.
                        </td>
                      </tr>
                      <tr v-for="(ex, i) in activeExercises" :key="i">
                        <td>{{ ex.name }}</td>
                        <td>{{ ex.sets ?? "-" }}</td>
                        <td>{{ ex.reps ?? "-" }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section class="custom-card mb-5">
          <h5 class="section-title">MY TRAININGS LIST</h5>
          <div class="table-responsive">
            <table class="table custom-table text-white mb-0">
              <thead>
                <tr>
                  <th class="hr">Training Name</th>
                  <th class="hr">Created</th>
                  <th class="hr">Type</th>
                  <th class="hr">Muscle groups / Days</th>
                  <th class="hr col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="t in trainings"
                  :key="t.id"
                  :class="t.id === activeTrainingId ? 'highlight-row' : ''"
                  @click="setActive(t)"
                  class="training-row"
                >
                  <td>{{ t.name }}</td>
                  <td>{{ t.createdLabel }}</td>
                  <td class="text-capitalize">{{ t.type }}</td>
                  <td>
                    <template v-if="t.type === 'weekly'">
                      {{ Object.keys(t.plan || {}).join(", ") || "-" }}
                    </template>
                    <template v-else>
                      {{
                        (t.exercises || [])
                          .map((e) => e.group)
                          .filter(Boolean)
                          .filter((v, i, a) => a.indexOf(v) === i)
                          .join(", ") || "-"
                      }}
                    </template>
                  </td>
                  <td>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      :disabled="deletingId === t.id"
                      @click.stop="deleteTraining(t)"
                      title="Delete training"
                    >
                      <span
                        v-if="deletingId === t.id"
                        class="spinner-border spinner-border-sm me-1"
                      ></span>
                      Delete
                    </button>
                  </td>
                </tr>
                <tr v-if="!trainings.length">
                  <td colspan="5" class="text-center text-muted">
                    You don't have any trainings yet.
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
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  name: "Training",
  data() {
    return {
      activeTrainingId: null,
      currentDay: null,
      currentGroup: null,
      trainings: [],
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      deletingId: null,
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    selectedTraining() {
      return this.trainings.find((t) => t.id === this.activeTrainingId) || null;
    },
    selectedIsWeekly() {
      return this.selectedTraining?.type === "weekly";
    },
    selectedIsDaily() {
      return this.selectedTraining?.type === "daily";
    },
    dailyHasDays() {
      if (!this.selectedIsDaily) return false;
      return (this.selectedTraining?.exercises || []).some((e) => !!e.day);
    },
    selectedDays() {
      if (!this.selectedTraining) return [];
      if (this.selectedIsWeekly) {
        const days = Object.keys(this.selectedTraining.plan || {});
        return days.length ? days : this.days;
      }
      if (this.selectedIsDaily && this.dailyHasDays) {
        const ds = [
          ...new Set(
            (this.selectedTraining.exercises || [])
              .map((e) => e.day)
              .filter(Boolean)
          ),
        ];
        return ds.length ? ds : this.days;
      }
      return [];
    },
    activeExercises() {
      if (!this.selectedTraining) return [];

      if (this.selectedIsWeekly) {
        const day = this.currentDay;
        if (!day) return [];
        const groupsObj = this.selectedTraining.plan?.[day] || {};
        const rows = [];
        Object.values(groupsObj).forEach((list) => {
          (list || []).forEach((ex) => rows.push(ex));
        });
        return rows;
      }

      const list = this.selectedTraining.exercises || [];
      if (this.dailyHasDays) {
        if (!this.currentDay || !this.currentGroup) return [];
        return list
          .filter(
            (e) => e.day === this.currentDay && e.group === this.currentGroup
          )
          .map((e) => ({ name: e.name, sets: e.sets, reps: e.reps }));
      } else {
        if (!this.currentGroup) return [];
        return list
          .filter((e) => e.group === this.currentGroup)
          .map((e) => ({ name: e.name, sets: e.sets, reps: e.reps }));
      }
    },
  },
  methods: {
    groupsForDay(day) {
      if (!this.selectedTraining) return [];
      if (this.selectedIsWeekly) {
        const obj = this.selectedTraining?.plan?.[day] || {};
        return Object.keys(obj);
      }

      const list = (this.selectedTraining.exercises || []).filter((e) =>
        this.dailyHasDays && day ? e.day === day : true
      );
      return [...new Set(list.map((e) => e.group).filter(Boolean))];
    },
    selectDay(day) {
      this.currentDay = day;
      if (this.selectedIsWeekly) {
        this.currentGroup = null;
        return;
      }
      if (this.selectedIsDaily && this.dailyHasDays) {
        const groups = this.groupsForDay(day);
        this.currentGroup = groups[0] || null;
      }
    },
    selectGroup(group) {
      this.currentGroup = group;
    },
    setActive(t) {
      this.activeTrainingId = t.id;

      if (this.selectedIsWeekly) {
        const days = this.selectedDays;
        this.currentDay = days[0] || null;
        this.currentGroup = null;
        return;
      }

      if (this.dailyHasDays) {
        const days = this.selectedDays;
        const firstDay = days[0] || null;
        this.currentDay = firstDay;
        const groups = this.groupsForDay(firstDay);
        this.currentGroup = groups[0] || null;
      } else {
        this.currentDay = null;
        const groups = this.groupsForDay(null);
        this.currentGroup = groups[0] || null;
      }
    },
    subscribeTrainings() {
      const uid = getAuth().currentUser?.uid;
      if (!uid) return;

      const q = query(
        collection(db, "users", uid, "trainings"),
        orderBy("createdAt", "desc")
      );

      this._unsubTrainings = onSnapshot(q, (snap) => {
        const list = [];
        snap.forEach((docSnap) => {
          const d = docSnap.data() || {};
          const createdAt =
            d.createdAt?.toDate?.() instanceof Date
              ? d.createdAt.toDate()
              : d.createdAt || null;
          list.push({
            id: docSnap.id,
            name: d.name || "(no name)",
            type: d.type || "daily",
            plan: d.plan || null,
            exercises: d.exercises || d.flatExercises || [],
            createdAt,
            createdLabel: createdAt
              ? createdAt.toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })
              : "-",
          });
        });
        this.trainings = list;

        if (!this.activeTrainingId && this.trainings.length) {
          this.setActive(this.trainings[0]);
        }
      });
    },
    async deleteTraining(t) {
      try {
        const ok = confirm(`Obrisati trening "${t.name}"?`);
        if (!ok) return;

        const uid = getAuth().currentUser?.uid;
        if (!uid) {
          alert("Moraš biti prijavljen.");
          return;
        }

        this.deletingId = t.id;

        await deleteDoc(doc(db, "users", uid, "trainings", t.id));

        if (this.activeTrainingId === t.id) {
          this.activeTrainingId = null;
          this.currentDay = null;
          this.currentGroup = null;
        }
      } catch (e) {
        console.error("Delete error:", e);
        alert(`Brisanje nije uspjelo: ${e.code || e.message || "unknown"}`);
      } finally {
        this.deletingId = null;
      }
    },
  },
  mounted() {
    this.subscribeTrainings();
  },
  beforeUnmount() {
    if (this._unsubTrainings) this._unsubTrainings();
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

.trainings-content {
  flex: 1;
  padding: 30px;
  background: #000;
  overflow-y: auto;
}

.trainings-top-row {
  align-items: stretch;
}

.new-training-actions {
  width: 260px;
}

.custom-card,
.training-plan {
  background-color: #111;
  border-radius: 16px;
  padding: 18px 20px 22px;
  box-shadow: 0 0 18px rgba(0, 0, 0, 0.7);
}

.title {
  font-weight: bold;
}

.section-title {
  font-weight: 600;
  font-size: 1rem;
  color: #fff;
  margin-bottom: 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.plan-selector {
  min-width: 220px;
}

.btn-outline-warning {
  border-color: #ffc107;
  color: #ffc107;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
}

.btn-outline-warning:hover {
  background-color: #ffc107;
  color: #000;
}

.day-chip,
.group-chip {
  white-space: nowrap;
}

.custom-table {
  background-color: #222 !important;
}

.table > :not(caption) > * > * {
  padding: 0.5rem 0.6rem;
  background-color: #222;
  border-bottom: 1px solid #333;
}

.custom-table thead th {
  color: #fff;
  font-weight: 600;
  border-bottom: 2px solid #555;
  font-size: 0.9rem;
}

.custom-table tbody td {
  color: #fff;
  font-size: 0.9rem;
}

.hr {
  border-bottom: 2px solid #888;
}

.col-sets,
.col-reps {
  width: 90px;
  text-align: center;
}

.col-actions {
  width: 1%;
  white-space: nowrap;
}

.training-row {
  cursor: pointer;
  transition: background-color 0.12s ease, color 0.12s ease;
}

.training-row:hover td {
  background-color: #333 !important;
}

.highlight-row td {
  background-color: #ffc107 !important;
  color: #000 !important;
  font-weight: 600;
}

.btn.btn-warning {
  background-color: #ffc107;
  color: #000;
  border: none;
  border-radius: 10px;
  padding: 10px 15px;
  font-weight: bold;
}

.btn.btn-warning:hover {
  background-color: #ffcd39;
}

.btn-outline-danger {
  border-color: #ffffff;
  color: #ffffff;
}

.btn-outline-danger:hover:enabled {
  background-color: #000000;
  color: #fff;
}

.d-flexy {
  display: flex !important;
  align-items: flex-end;
}
</style>

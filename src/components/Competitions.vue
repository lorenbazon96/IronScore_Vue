<template>
  <div class="container-fluid">
    <div class="row min-vh-100">
      <!-- SIDEBAR -->
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
          <router-link to="/dashboard" class="menu-item">Dashboard</router-link>
          <router-link to="/competitions" class="menu-item active-item"
            >Competitions</router-link
          >
          <router-link to="/community" class="menu-item">Community</router-link>
          <router-link to="/timer" class="menu-item">Timer</router-link>
          <router-link to="/trainings" class="menu-item">Trainings</router-link>
        </nav>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="competitions-content col-12 col-md-9 bg-black text-white">
        <!-- TOP BAR -->
        <header
          class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3"
        >
          <h2 class="title text-warning text-uppercase fw-bold mb-2 mb-md-0">
            Competitions
          </h2>

          <div class="d-flex align-items-center gap-2">
            <router-link
              to="/ncompetitions"
              class="btn btn-warning btn-sm fw-bold text-uppercase"
            >
              + New competition
            </router-link>

            <router-link
              to="/"
              class="btn btn-link text-warning fw-bold p-0 logout-link d-flex align-items-center text-uppercase"
            >
              <img
                src="@/assets/logout.png"
                alt="Logout"
                class="logout-icon me-1"
              />
              Log Out
            </router-link>
          </div>
        </header>

        <!-- MY RESULTS SECTION -->
        <section>
          <!-- Title + quick stats -->
          <div
            class="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-3"
          >
            <h3 class="text-white text-uppercase fw-bold mb-3 mb-lg-0">
              My Results
            </h3>

            <div class="d-flex flex-wrap stats-wrapper">
              <div class="stat-pill">
                <span class="stat-label">Total</span>
                <span class="stat-value">{{ totalCompetitions }}</span>
              </div>
              <div class="stat-pill">
                <span class="stat-label">Past</span>
                <span class="stat-value">{{ pastCompetitions }}</span>
              </div>
              <div class="stat-pill">
                <span class="stat-label">Upcoming</span>
                <span class="stat-value">{{ upcomingCompetitions }}</span>
              </div>
            </div>
          </div>

          <!-- FILTERS (kompaktno) -->
          <div
            class="filters d-flex flex-wrap gap-2 align-items-end mb-3 bg-dark px-3 py-2 rounded-3"
          >
            <div class="filter-item">
              <label class="filter-label">Year</label>
              <select
                v-model="selectedYear"
                class="form-select form-select-sm bg-black text-white border-secondary"
              >
                <option value="all">All</option>
                <option v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>

            <div class="filter-item">
              <label class="filter-label">Sort by</label>
              <select
                v-model="sortOrder"
                class="form-select form-select-sm bg-black text-white border-secondary"
              >
                <option value="date_desc">Date: newest</option>
                <option value="date_asc">Date: oldest</option>
                <option value="loc_asc">Location: A–Z</option>
                <option value="loc_desc">Location: Z–A</option>
              </select>
            </div>

            <div class="filter-item flex-grow-1">
              <label class="filter-label">Search</label>
              <input
                v-model="searchQuery"
                type="text"
                class="form-control form-control-sm bg-black text-white border-secondary"
                placeholder="Search by name or location..."
              />
            </div>
          </div>

          <!-- SCROLL ZONA ZA GRID – samo ovo se skrola -->
          <div class="results-scroll">
            <!-- GRID OF CARDS -->
            <div v-if="filteredCompetitions.length" class="row g-3">
              <div
                v-for="competition in filteredCompetitions"
                :key="competition.id"
                class="col-12 col-sm-6 col-lg-4"
              >
                <div class="card competition-card h-100">
                  <div class="card-body d-flex flex-column">
                    <!-- Gornji red: naziv (link) + pin + status -->
                    <div class="d-flex justify-content-between mb-2">
                      <!-- Klik na naslov otvara detalje -->
                      <router-link
                        :to="`/competition?id=${competition.id}`"
                        class="d-flex align-items-center text-decoration-none text-dark flex-grow-1"
                      >
                        <i class="fa-solid fa-trophy me-2 trophy-icon"></i>
                        <h6 class="mb-0 card-title-text">
                          {{ competition.name }}
                        </h6>
                      </router-link>

                      <div class="d-flex align-items-center gap-2 ms-2">
                        <button
                          type="button"
                          class="pin-btn"
                          @click.stop="togglePin(competition)"
                          :title="
                            competition.pinned
                              ? 'Unpin'
                              : 'Pin this competition'
                          "
                        >
                          <i
                            class="fa-solid fa-bookmark"
                            :class="
                              competition.pinned
                                ? 'pinned-icon'
                                : 'unpinned-icon'
                            "
                          ></i>
                        </button>

                        <!-- STATUS ICON -->
                        <div class="status-icon">
                          <i
                            v-if="isPast(competition.date)"
                            class="fa-solid fa-calendar-check past-icon"
                            title="Past competition"
                          ></i>
                          <i
                            v-else
                            class="fa-regular fa-clock upcoming-icon"
                            title="Upcoming competition"
                          ></i>
                        </div>
                      </div>
                    </div>

                    <!-- Ostatak kartice vodi na detalje -->
                    <router-link
                      :to="`/competition?id=${competition.id}`"
                      class="text-decoration-none text-dark flex-grow-1 d-block"
                    >
                      <!-- Datum + lokacija -->
                      <small class="text-muted mb-1 d-flex align-items-center">
                        <i class="fa-regular fa-calendar me-1"></i>
                        {{ formatDate(competition.date) }}
                      </small>

                      <small class="mb-2 d-flex align-items-center">
                        <i class="fa-solid fa-location-dot me-1"></i>
                        {{ competition.location }}
                      </small>

                      <!-- DODATNI PODACI U KARTICI (prikazuju se samo ako postoje u bazi) -->
                      <div class="mt-1 small d-flex flex-wrap gap-1">
                        <span v-if="competition.category" class="badge-chip">
                          <i class="fa-solid fa-tag me-1"></i>
                          {{ competition.category }}
                        </span>

                        <span v-if="competition.division" class="badge-chip">
                          <i class="fa-solid fa-user-group me-1"></i>
                          {{ competition.division }}
                        </span>

                        <span v-if="competition.placing" class="badge-chip">
                          <i class="fa-solid fa-medal me-1"></i>
                          {{ competition.placing }}
                        </span>

                        <span v-if="competition.result" class="badge-chip">
                          <i class="fa-solid fa-dumbbell me-1"></i>
                          {{ competition.result }}
                        </span>
                      </div>

                      <!-- kategorije desno -->
                      <div
                        v-if="displayedCategories(competition).length"
                        class="mt-1 d-flex justify-content-end flex-wrap gap-1 category-chips"
                      >
                        <span
                          v-for="cat in displayedCategories(competition)"
                          :key="cat"
                          class="badge-chip small-badge"
                        >
                          {{ cat }}
                        </span>
                        <span
                          v-if="hasMoreCategories(competition)"
                          class="badge-chip small-badge"
                        >
                          ...
                        </span>
                      </div>
                    </router-link>

                    <!-- Godina dolje desno, čisto radi orijentacije -->
                    <small class="mt-auto text-end text-muted">
                      {{ new Date(competition.date).getFullYear() }}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <!-- EMPTY STATE -->
            <div v-else class="text-center py-5">
              <img
                src="@/assets/trophy.png"
                alt="trophy"
                class="trophy-img mb-3"
              />
              <p class="mb-3">No competitions found.</p>
              <router-link
                to="/ncompetitions"
                class="btn btn-warning fw-bold text-uppercase"
              >
                Create your first competition
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
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export default {
  name: "Competitions",
  data() {
    return {
      competitions: [],
      selectedYear: "all",
      sortOrder: "date_desc", // date_desc | date_asc | loc_asc | loc_desc
      searchQuery: "",
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },

    years() {
      const yearsSet = new Set(
        this.competitions
          .filter((c) => c.date)
          .map((c) => new Date(c.date).getFullYear())
      );
      return Array.from(yearsSet).sort((a, b) => b - a);
    },

    sortedCompetitions() {
      const comps = [...this.competitions];

      return comps.sort((a, b) => {
        const pa = a.pinned ? 1 : 0;
        const pb = b.pinned ? 1 : 0;

        // prvo po pinanju (pinned gore)
        if (pa !== pb) {
          return pb - pa; // 1 prije 0
        }

        const da = new Date(a.date);
        const db = new Date(b.date);
        const la = (a.location || "").toString().toLowerCase();
        const lb = (b.location || "").toString().toLowerCase();

        // pa onda po odabranom sortOrder
        switch (this.sortOrder) {
          case "date_asc":
            return da - db;
          case "loc_asc":
            if (la === lb) return db - da; // fallback na datum
            return la.localeCompare(lb);
          case "loc_desc":
            if (la === lb) return db - da;
            return lb.localeCompare(la);
          case "date_desc":
          default:
            return db - da;
        }
      });
    },

    filteredCompetitions() {
      const search = this.searchQuery.trim().toLowerCase();

      return this.sortedCompetitions.filter((c) => {
        const date = c.date ? new Date(c.date) : null;
        const year = date ? date.getFullYear() : null;

        const matchYear =
          this.selectedYear === "all" || year === Number(this.selectedYear);

        const matchSearch =
          !search ||
          (c.name && c.name.toLowerCase().includes(search)) ||
          (c.location && c.location.toLowerCase().includes(search));

        return matchYear && matchSearch;
      });
    },

    totalCompetitions() {
      return this.competitions.length;
    },
    pastCompetitions() {
      return this.competitions.filter((c) => this.isPast(c.date)).length;
    },
    upcomingCompetitions() {
      return this.competitions.filter((c) => !this.isPast(c.date)).length;
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
    async togglePin(competition) {
      const newValue = !competition.pinned;

      // 1. odmah promijeni lokalno (UI reagira odmah)
      competition.pinned = newValue;

      try {
        const ref = doc(db, "competitions", competition.id);
        await updateDoc(ref, { pinned: newValue });
      } catch (error) {
        console.error("Error updating pin:", error);
        // 2. za sad NE vraćamo staru vrijednost da ne blinka
        // ako želiš, ovdje možeš staviti neki toast/alert:
        // alert("Ne mogu spremiti pin u bazu");
      }
    },
    isPast(date) {
      const today = new Date();
      const compDate = new Date(date);
      return compDate < today;
    },
    formatDate(date) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    displayedCategories(competition) {
      const cats = Array.isArray(competition.categories)
        ? competition.categories.filter(Boolean)
        : [];
      return cats.slice(0, 2);
    },
    hasMoreCategories(competition) {
      const cats = Array.isArray(competition.categories)
        ? competition.categories.filter(Boolean)
        : [];
      return cats.length > 2;
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

.bg-darka {
  background-color: #000 !important;
}

/* sidebar */
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

/* main */
.competitions-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.title {
  font-weight: bold;
}

.logout-link {
  color: #ffc107 !important;
  font-size: 13px;
}

.logout-icon {
  width: 18px;
  height: 18px;
}

/* stats */
.stats-wrapper {
  gap: 6px;
}

.stat-pill {
  background-color: #111;
  border-radius: 999px;
  padding: 4px 10px;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-label {
  font-size: 10px;
  text-transform: uppercase;
  color: #aaa;
}

.stat-value {
  font-size: 13px;
  font-weight: 700;
  color: #ffc107;
}

/* filters */
.filters {
  border-radius: 10px;
}

.filter-item {
  min-width: 130px;
}

.filter-label {
  display: block;
  font-size: 10px;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 2px;
}

.trophy-img {
  width: 7rem;
  height: auto;
}

/* DESNI PANEL */
.competitions-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100vh; /* zauzmi cijelu visinu prozora */
  overflow: hidden; /* ovdje ništa ne skrola, skrola samo dijete */
}

/* zona s rezultatima ima vlastiti scroll */
.results-scroll {
  flex: 1; /* zauzmi sav preostali prostor u sekciji */
  overflow-y: auto; /* vertikalni scroll samo ovdje */
  overflow-x: hidden; /* nema horizontalnog skrola */
  padding-right: 4px;
  min-height: 0; /* bitno da flex dijete može scrollati */
}

/* scrollbar (opcionalno) */
.results-scroll::-webkit-scrollbar {
  width: 6px;
}
.results-scroll::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 3px;
}
.results-scroll::-webkit-scrollbar-track {
  background-color: #111;
}

.past-icon {
  color: #888;
}
.upcoming-icon {
  color: #ffc107;
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

.category-chips {
  max-width: 100%;
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

.competitions-content > section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.container-fluid,
.row,
.competitions-content {
  overflow-x: hidden;
}

.card-title-text {
  font-size: 16px;
  font-weight: 600;
}

.trophy-icon {
  color: #ffc107;
  font-size: 1.3rem;
}

.status-icon i {
  font-size: 1.2rem;
}

.pin-btn {
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  cursor: pointer;
  line-height: 1;
}

.pinned-icon {
  color: #ffc107;
}

.unpinned-icon {
  color: #888;
  opacity: 0.75;
}

.pin-btn i {
  font-size: 1.25rem;
}

.competition-card {
  border-radius: 12px;
  border: 1px solid #333;
  background-color: #fff;
  padding: 8px 10px;
  transition: transform 0.1s ease, box-shadow 0.1s ease, border-color 0.1s ease;
}

.competition-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 14px rgba(255, 193, 7, 0.35);
  border-color: #ffc107;
}
</style>

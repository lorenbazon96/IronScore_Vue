<template>
  <div class="training-container">
    <aside class="sidebar">
      <div class="logo">
        <img src="@/assets/logo-t.png" alt="IronScore Logo" />
      </div>
      <div class="user-info">
        <router-link to="/edit-account" class="edit">Edit Account</router-link>
        <p><strong>Name:</strong> Example</p>
        <p><strong>Surname:</strong> Example</p>
        <p><strong>Email:</strong> example@gmail.com</p>
        <p><strong>Age:</strong> 25</p>
        <p><strong>Account type:</strong> Regular</p>
      </div>
      <nav class="menu">
        <router-link to="/dashboard" class="menu-item">Dashboard</router-link>
        <router-link to="/competitions" class="menu-item"
          >competitions</router-link
        >
        <router-link to="/community" class="menu-item">Community</router-link>
        <router-link to="/timer" class="menu-item">Timer</router-link>
        <router-link to="/trainings" class="menu-item active-item"
          >Trainings</router-link
        >
      </nav>
    </aside>

    <main class="training-content trainings-content container-fluid px-5">
      <header class="training-header trainings-header">
        <h2 class="title trainings-title">Trainings</h2>
        <router-link
          to="/"
          class="btn btn-link text-warning fw-bold p-0 logout-link"
        >
          Log Out
        </router-link>
      </header>

      <div class="d-flex gap-4 align-items-start mb-5 flex-wrap">
        <div class="d-flex flex-column gap-3" style="width: 250px">
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

        <section
          class="training-plan custom-card"
          style="flex: 1; min-width: 300px"
        >
          <h4 class="section-title">FULL BODY WEEKLY PLAN</h4>
          <div class="table-responsive mt-3">
            <table class="table custom-table text-white">
              <thead>
                <tr>
                  <th></th>
                  <th class="hr">Exercise</th>
                  <th class="hr">Sets</th>
                  <th class="hr">Reps</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(exercise, index) in weeklyPlan" :key="index">
                  <td
                    :class="{ 'text-warning fw-bold': exercise.day === 'FRI' }"
                  >
                    {{ exercise.day }}
                  </td>
                  <td>{{ exercise.name }}</td>
                  <td>{{ exercise.sets || "-" }}</td>
                  <td>{{ exercise.reps || "-" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section class="custom-card mb-5">
        <h5 class="section-title">MY TRAININGS LIST</h5>
        <div class="table-responsive">
          <table class="table custom-table text-white">
            <thead>
              <tr>
                <th class="hr">Training Name</th>
                <th class="hr">Create at</th>
                <th class="hr">Type</th>
                <th class="hr">Muscle group</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(training, index) in trainings"
                :key="index"
                :class="{
                  'highlight-row': training.name === 'Upper Body Shred',
                }"
              >
                <td>{{ training.name }}</td>
                <td>{{ training.created }}</td>
                <td>{{ training.type }}</td>
                <td>{{ training.group }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: "trainingView",
  data() {
    return {
      weeklyPlan: [
        { day: "TUE", name: "Pull-Ups", sets: 3, reps: "Max reps" },
        { day: "WED", name: "Bench Press", sets: 4, reps: 8 },
        { day: "THU", name: "Leg Raises", sets: 3, reps: 15 },
        { day: "FRI", name: "", sets: "", reps: "" },
        { day: "SAT", name: "", sets: "", reps: "" },
        { day: "SUN", name: "", sets: "", reps: "" },
      ],

      trainings: [
        {
          name: "Full Body Weekly Plan",
          created: "March 4, 2024",
          type: "weekly",
          group: "Full body",
        },
        {
          name: "Strength Split Plan",
          created: "March 5, 2024",
          type: "daily",
          group: "Chest, Back, Legs",
        },
        {
          name: "Upper Body Shred",
          created: "March 11, 2024",
          type: "weekly",
          group: "Chest, Shoulders, Back",
        },
      ],
    };
  },
};
</script>

<style scoped>
.training-container {
  display: flex;
  height: 100vh !important;
  font-family: "Roboto", sans-serif;
  color: #fff;
  background: #000;
}

@media (min-width: 992px) {
  .training-container {
    flex-direction: row;
  }
}

.sidebar {
  width: 250px;
  background: #111;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
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

.logout-link {
  color: #ffc107 !important;
  font-size: 14px;
  text-transform: uppercase;
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
  background-color: #2b2b2b;
  border-radius: 20px;
  padding: 15px;
  color: #fff;
}

.section-title {
  font-weight: bold;
  font-size: 20px;
  color: #fff;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.custom-table {
  background-color: #444 !important;
}
.custom-table thead th {
  color: #fff;
  font-weight: 600;
}

.custom-table tbody td {
  color: #fff;
  font-size: 17px;
}

.highlight-row td {
  background-color: #ffc107 !important;
  color: #000 !important;
  font-weight: bold;
}

.btn.btn-warning {
  background-color: #ffc107;
  color: #000;
  border: none;
  border-radius: 6px;
  padding: 10px 15px;
  font-weight: bold;
  margin-top: 50px;
}

.btn.btn-warning:hover {
  background-color: #ffcd39;
}

.table td,
.table th {
  border: none;
}

.table > :not(caption) > * > * {
  padding: 0.5rem 0.5rem;
  background-color: rgb(43, 43, 43);
}

.table th {
  font-size: 17px;
}

.custom-table tbody tr td:first-child {
  font-weight: 700;
  font-size: 17px;
}

.hr {
  border-bottom: 2px solid #888;
}

.custom-table tbody td[data-v-68c42c0a] {
  color: #fff;
  font-size: 15px;
}

.custom-table thead th.hr {
  border-bottom: 2px solid #888;
}

.edit {
  color: #ffc107;
}
</style>

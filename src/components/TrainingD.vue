<template>
  <div class="container-fluid">
    <div class="row min-vh-100">
      <aside class="col-12 col-md-3 sidebar bg-dark text-white p-3">
        <div class="logo mb-3">
          <img
            src="@/assets/logo-t.png"
            alt="IronScore Logo"
            class="img-fluid"
          />
        </div>
        <div class="user-info border-top pt-2 mb-3">
          <router-link to="/edit-account" class="edit d-block mb-2"
            >Edit Account</router-link
          >
          <p><strong>Name:</strong> Example</p>
          <p><strong>Surname:</strong> Example</p>
          <p><strong>Email:</strong> example@gmail.com</p>
          <p><strong>Age:</strong> 25</p>
          <p><strong>Account type:</strong> Regular</p>
        </div>
        <nav class="menu d-flex flex-column gap-2">
          <router-link to="/dashboard" class="menu-item">Dashboard</router-link>
          <router-link to="/competitions" class="menu-item"
            >Competitions</router-link
          >
          <router-link to="/community" class="menu-item">Community</router-link>
          <router-link to="/timer" class="menu-item">Timer</router-link>
          <router-link to="/trainings" class="menu-item active-item"
            >Trainings</router-link
          >
        </nav>
      </aside>

      <main class="col-12 col-md-9 training-content p-4 bg-black text-white">
        <header class="training-header trainings-header">
          <h2 class="title trainings-title">Trainings</h2>
          <router-link
            to="/"
            class="btn btn-link text-warning fw-bold p-0 logout-link"
          >
            Log Out
          </router-link>
        </header>

        <div class="mb-3">
          <label for="trainingName" class="text-white fw-bold me-2 text-start"
            >Training Name:</label
          >
          <input
            type="text"
            id="trainingName"
            class="form-control d-inline-block"
            style="width: 300px"
            v-model="trainingName"
            placeholder="example weekly training"
          />
        </div>

        <div class="d-flex gap-5 align-items-start flex-wrap">
          <div
            class="custom-card p-3"
            style="
              flex: 1;
              min-width: 300px;
              max-height: 600px;
              overflow-y: auto;
            "
          >
            <div v-for="group in muscleGroups" :key="group" class="mb-4">
              <h5 class="section-title">{{ group.toUpperCase() }}</h5>
              <hr />
              <div
                v-for="(exercise, index) in exercisesByGroup(group)"
                :key="index"
                class="d-flex align-items-start gap-3 border-bottom pb-3 mb-3"
              >
                <img
                  :src="exercise.image"
                  alt="exercise"
                  width="160"
                  height="160"
                />
                <div class="flex-grow-1">
                  <strong class="exercise-name">{{ exercise.name }}</strong>
                  <div class="d-flex gap-4 mt-2 flex-wrap">
                    <span>Sets</span>
                    <input
                      v-model.number="exercise.sets"
                      type="number"
                      min="1"
                      class="form-control form-control-sm"
                      placeholder="Sets"
                      style="width: 70px"
                    />
                    <span>Reps</span>
                    <input
                      v-model.number="exercise.reps"
                      type="number"
                      min="1"
                      class="form-control form-control-sm"
                      placeholder="Reps"
                      style="width: 70px"
                    />
                    <button
                      class="btn btn-md btn-warning"
                      @click="addExercise(exercise)"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="custom-card-finish p-3"
            style="width: 400px; max-height: 500px; overflow-y: auto"
          >
            <h5 class="section-title-finish">ADDED ON TRAINING</h5>
            <div v-for="group in visibleGroups" :key="group" class="mb-2">
              <strong class="text-white text-uppercase">{{ group }}</strong>
              <ul class="list-group mb-2">
                <li
                  v-for="(ex, i) in exercisesByGroupInSelection(group)"
                  :key="i"
                  class="list-group-item text-dark d-flex justify-content-between align-items-center border-secondary"
                >
                  {{ ex.name }} – {{ ex.sets }} sets x {{ ex.reps }} reps
                  <button
                    class="btn btn-sm btn-danger"
                    @click="removeExercise(ex)"
                  >
                    Remove
                  </button>
                </li>
              </ul>
            </div>

            <button class="btn btn-warning w-100 fw-bold mt-3">
              Finish and save training
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewTrainingsWeekly",
  data() {
    return {
      trainingName: "",
      muscleGroups: ["Chest", "Abs", "Legs", "Back", "Arms", "Shoulder"],
      availableExercises: [
        {
          name: "Bench Press",
          image: require("@/assets/exercises/benchpress.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Chest",
        },
        {
          name: "Dumbbell Flys",
          image: require("@/assets/exercises/dumbbellflys.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Chest",
        },
        {
          name: "Dips",
          image: require("@/assets/exercises/dips.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Chest",
        },
        {
          name: "Dumbbell bench press",
          image: require("@/assets/exercises/dumbbell_bench_press.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Chest",
        },
        {
          name: "Incline bench press",
          image: require("@/assets/exercises/incline_bench_press.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Chest",
        },
        {
          name: "Incline dumbbell bench press",
          image: require("@/assets/exercises/incline_dumbbell_bench_press.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Chest",
        },
        {
          name: "Decline dumbbell bench press",
          image: require("@/assets/exercises/decline_dumbbell_bench_press.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Chest",
        },
        {
          name: "Incline dumbbell fly",
          image: require("@/assets/exercises/incline_dumbbell_fly.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Chest",
        },
        {
          name: "Dumbbell pullover",
          image: require("@/assets/exercises/dumbbell_pullover.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Chest",
        },
        {
          name: "High-to-low cable chest fly",
          image: require("@/assets/exercises/high-to-low-cable-chest-fly.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Chest",
        },
        {
          name: "Barbell bent-over row",
          image: require("@/assets/exercises/barbell-bent-over-row.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Back",
        },
        {
          name: "Pull-up",
          image: require("@/assets/exercises/pull-up.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Back",
        },
        {
          name: "Lat pulldown",
          image: require("@/assets/exercises/lat-pulldown.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Back",
        },
        {
          name: "Seated cable row",
          image: require("@/assets/exercises/seated-cable-row.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Back",
        },
        {
          name: "One-arm dumbbell row",
          image: require("@/assets/exercises/one-arm-dumbbell-row.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Back",
        },
        {
          name: "Deadlift",
          image: require("@/assets/exercises/deadlift.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Back",
        },
        {
          name: "Shoulder press",
          image: require("@/assets/exercises/shoulder-press.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Back",
        },
        {
          name: "Barbell good morning",
          image: require("@/assets/exercises/barbell-good-morning.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Back",
        },
        {
          name: "Hyperextension",
          image: require("@/assets/exercises/hyperextension.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Back",
        },
        {
          name: "T-bar row",
          image: require("@/assets/exercises/t-bar-row.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Back",
        },
        {
          name: "Dumbbell deadlift",
          image: require("@/assets/exercises/dumbbell-deadlift.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Back",
        },
        {
          name: "Squats",
          image: require("@/assets/exercises/squats.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Legs",
        },
        {
          name: "Leg press",
          image: require("@/assets/exercises/leg-press.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Legs",
        },
        {
          name: "Leg extension",
          image: require("@/assets/exercises/leg-extension.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Legs",
        },
        {
          name: "Hack squat",
          image: require("@/assets/exercises/hack-squat.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Legs",
        },
        {
          name: "Dumbbell lunge",
          image: require("@/assets/exercises/dumbbell-lunge.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Legs",
        },
        {
          name: "Dumbbell squat",
          image: require("@/assets/exercises/dumbbell-squat.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Legs",
        },
        {
          name: "Lying leg curl",
          image: require("@/assets/exercises/lying-leg-curl.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Legs",
        },
        {
          name: "Romanian deadlift",
          image: require("@/assets/exercises/romanian-deadlift.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Legs",
        },
        {
          name: "Romanian dumbbell deadlift",
          image: require("@/assets/exercises/romanian-dumbbell-deadlift.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Legs",
        },
        {
          name: "Standing calf raise",
          image: require("@/assets/exercises/standing-calf-raise.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Legs",
        },
        {
          name: "Seated calf raise",
          image: require("@/assets/exercises/seated-calf-raise.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Legs",
        },
        {
          name: "Donkey calf raise",
          image: require("@/assets/exercises/donkey-calf-raise.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Legs",
        },
        {
          name: "Seated barbell shoulder press",
          image: require("@/assets/exercises/seated-barbell-shoulder-press.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Shoulder",
        },
        {
          name: "Seated dumbbell shoulder press",
          image: require("@/assets/exercises/seated-dumbbell-shoulder-press.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Shoulder",
        },
        {
          name: "Dumbbell lateral raise",
          image: require("@/assets/exercises/dumbbell-lateral-raise.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Shoulder",
        },
        {
          name: "Dumbbell alternating front raise",
          image: require("@/assets/exercises/dumbbell-alternating-front-raise.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Shoulder",
        },
        {
          name: "Seated bent-over rear delt raise",
          image: require("@/assets/exercises/seated-bent-over-rear-delt-raise.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Shoulder",
        },
        {
          name: "Arnold press",
          image: require("@/assets/exercises/arnold-press.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Shoulder",
        },
        {
          name: "One-arm dumbbell lateral raise",
          image: require("@/assets/exercises/one-arm-dumbbell-lateral-raise.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Shoulder",
        },
        {
          name: "One-arm cable lateral raise",
          image: require("@/assets/exercises/one-arm-cable-lateral-raise.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Shoulder",
        },
        {
          name: "Barbell biceps curl",
          image: require("@/assets/exercises/barbell-biceps-curl.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Arms",
        },
        {
          name: "Dumbbell biceps curl",
          image: require("@/assets/exercises/dumbbell-biceps-curl.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Arms",
        },
        {
          name: "Seated alternating dumbbell curl",
          image: require("@/assets/exercises/seated-alternating-dumbbell-curl.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Arms",
        },
        {
          name: "Concentration curl",
          image: require("@/assets/exercises/concentration-curl.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Arms",
        },
        {
          name: "Preacher curl",
          image: require("@/assets/exercises/preacher-curl.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Arms",
        },
        {
          name: "Incline dumbbell curl",
          image: require("@/assets/exercises/incline-dumbbell-curl.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Arms",
        },
        {
          name: "Close-Grip Pull-Up",
          image: require("@/assets/exercises/close-grip-pull-up.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Arms",
        },
        {
          name: "Close-Grip EZ Bar Bench Press",
          image: require("@/assets/exercises/close-grip-ez-bar-bench-press.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Arms",
        },
        {
          name: "Skull crusher",
          image: require("@/assets/exercises/skull-crusher.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Arms",
        },
        {
          name: "Triceps Extension",
          image: require("@/assets/exercises/triceps-extension.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Arms",
        },
        {
          name: "Dumbbell Triceps Kickback",
          image: require("@/assets/exercises/dumbbell-triceps-kickback.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Arms",
        },
        {
          name: "Dumbbell Overhead Triceps Extension",
          image: require("@/assets/exercises/overhead-triceps-extension.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Arms",
        },
        {
          name: "Seated Dumbbell Overhead Triceps Extension",
          image: require("@/assets/exercises/seated-overhead-triceps-extension.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Arms",
        },
        {
          name: "Reverse Barbell Curl",
          image: require("@/assets/exercises/reverse-barbell-curl.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Arms",
        },
        {
          name: "Seated Barbell Wrist Curl",
          image: require("@/assets/exercises/seated-barbell-wrist-curl.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Arms",
        },
        {
          name: "Seated Reversal Barbell Wrist Curl",
          image: require("@/assets/exercises/seated-reversal-barbell-wrist-curl.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Arms",
        },
        {
          name: "Crunches",
          image: require("@/assets/exercises/crunches.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Abs",
        },
        {
          name: "Hanging Leg Raises",
          image: require("@/assets/exercises/hanging-leg-raises.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Abs",
        },
        {
          name: "Incline Leg Raise",
          image: require("@/assets/exercises/incline-leg-raise.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Abs",
        },
        {
          name: "Incline Sit-Ups",
          image: require("@/assets/exercises/incline-sit-ups.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Abs",
        },
        {
          name: "Roman Sit-ups",
          image: require("@/assets/exercises/roman-sit-ups.png"),
          sets: 1,
          reps: 1,
          day: "Monday",
          group: "Abs",
        },
      ],
      selectedExercises: [],
    };
  },
  computed: {
    visibleGroups() {
      return [...new Set(this.selectedExercises.map((ex) => ex.group))];
    },
  },
  methods: {
    addExercise(ex) {
      if (!ex.sets || !ex.reps) {
        alert("Please fill in all fields before adding.");
        return;
      }
      this.selectedExercises.push({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        group: ex.group,
      });
    },
    removeExercise(exercise) {
      const index = this.selectedExercises.indexOf(exercise);
      if (index > -1) {
        this.selectedExercises.splice(index, 1);
      }
    },
    exercisesByGroup(group) {
      return this.availableExercises.filter((e) => e.group === group);
    },
    exercisesByGroupInSelection(group) {
      return this.selectedExercises.filter((ex) => ex.group === group);
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
</style>

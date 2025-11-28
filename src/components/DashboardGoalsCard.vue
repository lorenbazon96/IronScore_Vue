<template>
  <div class="card bg-dark text-white p-3 h-100 d-flex flex-column goals-card">
    <div class="goals-header text-center mb-2">
      <h5 class="mb-0 goals-title">My Goals</h5>

      <small v-if="goals.length" class="text-white-50">
        {{ goalsCompleted }} / {{ goals.length }} completed
      </small>
      <small v-else class="text-white-50">
        No goals yet – start by adding one.
      </small>
    </div>

    <div
      v-if="goals.length"
      class="goals-progress-circle d-flex flex-column align-items-center justify-content-center"
    >
      <span class="goals-progress-percent">{{ goalsProgress }}%</span>
      <span class="goals-progress-label">Done</span>
    </div>

    <div class="goals-list flex-grow-1 mt-3">
      <template v-if="goals.length">
        <div
          v-for="g in goals"
          :key="g.id"
          class="goals-item d-flex justify-content-between align-items-start"
        >
          <div class="d-flex align-items-start">
            <span
              class="goals-dot me-2"
              :class="g.completed ? 'goals-dot-complete' : 'goals-dot-active'"
            ></span>
            <span
              class="goals-text"
              :class="{
                'text-decoration-line-through text-secondary': g.completed,
              }"
            >
              {{ g.title }}
            </span>
          </div>

          <span
            class="badge goals-badge"
            :class="g.completed ? 'goals-badge-done' : 'goals-badge-active'"
          >
            {{ g.completed ? "✓ Done" : "Active" }}
          </span>
        </div>
      </template>

      <p v-else class="text-secondary small mb-0">
        You don’t have any goals yet. Click <strong>+ Add</strong> to create
        your first one.
      </p>
    </div>

    <div v-if="goals.length" class="mt-2">
      <div class="progress goals-progress bg-secondary">
        <div
          class="progress-bar bg-warning"
          role="progressbar"
          :style="{ width: goalsProgress + '%' }"
        ></div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mt-3">
      <router-link
        to="/goals"
        class="btn btn-warning btn-sm fw-bold flex-grow-1 me-2"
      >
        View all
      </router-link>

      <button class="btn btn-outline-warning btn-sm" @click="$emit('add')">
        + Add
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardGoalsCard",
  props: {
    goals: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    goalsCompleted() {
      return this.goals.filter((g) => g.completed).length;
    },
    goalsProgress() {
      if (!this.goals.length) return 0;
      return Math.round((this.goalsCompleted / this.goals.length) * 100);
    },
  },
};
</script>

<style scoped>
.goals-card {
  border-radius: 6px;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 320px;
  max-height: 320px;
}

.goals-title {
  color: #ffff;
}

.goals-list {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  margin-top: 12px;
  margin-bottom: 12px;
  padding-right: 4px;
}

.goals-item {
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.goals-item:last-child {
  border-bottom: none;
}

.goals-text {
  font-size: 0.95rem;
}

.goals-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 4px;
}

.goals-dot-active {
  background-color: #ffc107;
}

.goals-dot-complete {
  background-color: #ffc107;
}

.goals-badge {
  font-size: 0.7rem;
}

.goals-progress {
  height: 6px;
  border-radius: 4px;
  overflow: hidden;
}

.goals-progress-circle {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 2px solid #ffc107;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.goals-progress-percent {
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffc107;
  line-height: 1;
}

.goals-progress-label {
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #ffffffa0;
}

.goals-badge {
  font-size: 0.7rem;
  border-radius: 999px;
  padding: 2px 10px;
}

.goals-badge-active {
  background-color: #ffc107;
  color: #000;
}

.goals-badge-done {
  background-color: transparent;
  color: #cccccc;
  border: 1px solid #555555;
}

.goals-header {
  padding-top: 8px;
  margin-bottom: 8px;
}
</style>

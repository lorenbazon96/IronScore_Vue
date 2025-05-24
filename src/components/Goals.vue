<template>
  <div class="goals-container">
    <aside class="sidebar">
      <div class="logo">
        <img src="@/assets/logo-t.png" alt="IronScore Logo" />
      </div>
      <div class="user-info">
        <h4>Edit Account</h4>
        <p><strong>Name:</strong> Example</p>
        <p><strong>Surname:</strong> Example</p>
        <p><strong>Email:</strong> example@gmail.com</p>
        <p><strong>Age:</strong> 25</p>
        <p><strong>Account type:</strong> Regular</p>
      </div>
      <nav class="menu">
        <router-link to="/dashboard" class="menu-item active-item"
          >Dashboard</router-link
        >
        <router-link to="/competitions" class="menu-item"
          >competitions</router-link
        >
        <router-link to="/community" class="menu-item">Community</router-link>
        <router-link to="/timer" class="menu-item">Timer</router-link>
        <router-link to="/trainings" class="menu-item">Trainings</router-link>
      </nav>
    </aside>

    <main class="goals-content">
      <header class="goals-header">
        <h2 class="title">Dashboard</h2>
        <router-link to="/" class="btn btn-link text-warning fw-bold p-0"
          >Log Out</router-link
        >
      </header>

      <section class="container-fluid">
        <h3 class="text-white text-uppercase fw-bold mb-4">My Goals</h3>
        <div class="row g-4">
          <div class="col-md-8">
            <div class="card bg-dark text-white p-4">
              <h5 class="fw-bold text-uppercase mb-4">Goal List</h5>

              <div class="mb-4">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    checked
                    disabled
                  />
                  <label class="form-check-label fw-bold text-white">
                    Increase muscle mass by 5 kg in 12 weeks
                  </label>
                </div>
                <p class="text-white-50 mb-0">
                  Focus on hypertrophy training with progressive overload to
                  gain 5 kilograms of lean muscle.
                </p>
              </div>

              <div class="mb-4">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    checked
                    disabled
                  />
                  <label class="form-check-label fw-bold text-white">
                    Reduce body fat from 15% to 10% in 8 weeks
                  </label>
                </div>
                <p class="text-white-50 mb-0">
                  Implement a cutting phase with calorie deficit and cardio to
                  enhance muscle definition.
                </p>
              </div>

              <div class="mb-1">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" />
                  <label class="form-check-label fw-bold text-white">
                    Achieve a 150 kg squat within 16 weeks
                  </label>
                </div>
                <p class="text-white-50 mb-1">
                  Follow a structured strength program to progressively build
                  lower body power.
                  <span class="text-danger ms-2" style="cursor: pointer"
                    >Remove</span
                  >
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card p-4 bg-white text-dark">
              <h6 class="fw-bold mb-3">Add new goal:</h6>
              <div class="mb-3">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Held a plank 10 minutes..."
                />
              </div>
              <div class="mb-3">
                <input type="text" class="form-control" placeholder="how..." />
              </div>
              <button class="btn btn-dark w-100">Add</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Goals from "@/components/Goals.vue";

export default {
  name: "Goals",
  components: {
    Goals,
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.goals-container {
  display: flex;
  height: 100vh;
  font-family: "Roboto", sans-serif;
  color: #fff;
  background: #000;
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

.goals-content {
  flex: 1;
  padding: 30px;
  background: #000;
  overflow-y: auto;
}

.goals-header {
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

.logout {
  background: none;
  border: none;
  color: #ffc107;
  font-weight: bold;
  cursor: pointer;
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
</style>

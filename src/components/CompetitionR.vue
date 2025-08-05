<template>
  <div class="container-fluid">
    <div class="row min-vh-100">
      <aside class="col-12 col-md-3 sidebar bg-dark text-white p-3">
        <div class="logo">
          <img src="@/assets/logo-t.png" alt="IronScore Logo" />
        </div>
        <div class="user-info border-top pt-2 mb-3">
          <router-link to="/edit-r-account" class="edit"
            >Edit Account</router-link
          >
          <p><strong>Name:</strong> Example</p>
          <p><strong>Surname:</strong> Example</p>
          <p><strong>Email:</strong> example@gmail.com</p>
          <p><strong>Age:</strong> 25</p>
          <p><strong>Account type:</strong> Referee</p>
        </div>
        <nav class="menu">
          <router-link to="/competitionsr" class="menu-item active-item"
            >competitions</router-link
          >
          <router-link to="/communityfr" class="menu-item"
            >Community</router-link
          >
        </nav>
      </aside>

      <main
        class="competitions-content col-12 col-md-9 p-4 bg-black text-white"
      >
        <header class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="text-warning fw-bold text-uppercase">Competitions</h2>
          <router-link
            to="/"
            class="btn btn-link text-warning fw-bold p-0 logout-link"
            >Log Out</router-link
          >
        </header>

        <section class="text-white text-start">
          <h3 class="fw-bold text-uppercase mb-3">
            Ultimate Physique Championships
          </h3>
          <p class="mb-1"><strong>Date:</strong> April 20, 2025</p>
          <p class="mb-3"><strong>Location:</strong> Los Angeles, USA</p>
          <p>
            <strong>Categories:</strong> Men's Physique, Classic Bodybuilding,
            Women's Figure
          </p>
          <p class="mt-3">
            The competition will be evaluated by an official panel of 7
            certified judges, each with extensive experience in physique sports
            and IFBB-standard judging systems.<br />
            Judging is based on the following key aspects:
          </p>
          <ul>
            <li>
              Symmetry and Proportion: Balance between muscle groups, V-taper,
              and aesthetic appeal.
            </li>
            <li>
              Muscularity and Conditioning: Muscle development, definition, and
              low body fat.
            </li>
            <li>
              Presentation and Stage Presence: Posing technique, charisma, and
              overall confidence.
            </li>
            <li>
              Suitability to Category Standards: Each category (Men’s Physique,
              Classic, Figure) is judged by its own criteria.
            </li>
          </ul>
          <p class="mt-3">
            Each judge will assign a placing score from 1 (best) to N (worst)
            for each athlete. To ensure fairness, the highest and lowest scores
            are discarded, and the total is calculated from the remaining
            scores. The athlete with the lowest score achieves the best
            placement.
          </p>

          <div
            class="mt-5 d-flex flex-column flex-md-row justify-content-start gap-3"
          >
            <div class="text-center">
              <button class="btn btn-secondary px-4" disabled>
                Start Judging
              </button>
              <div class="text-warning mt-1 small">
                starting will be possible on the date of the event
              </div>
            </div>
            <div class="text-center">
              <button class="btn btn-secondary px-4" disabled>
                See result
              </button>
              <div class="text-warning mt-1 small">
                result will be possible after event
              </div>
            </div>
            <div class="text-center">
              <button class="btn btn-warning text-black fw-bold px-4">
                Cancel
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompetitionR",
  data() {
    return {};
  },
};
</script>

<style scoped>
.competitions-container {
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

.competitions-content {
  flex: 1;
  padding: 30px;
  background: #000;
  overflow-y: auto;
}

.competitions-header {
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

.logout-link {
  color: #ffc107 !important;
  font-size: 14px;
  text-transform: uppercase;
}

.medal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #111;
  padding: 20px;
  border-radius: 10px;
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

.result-item:last-child {
  border-bottom: none;
}

.trophy-img {
  width: 10em;
  height: auto;
  margin-bottom: 20px;
}

.edit {
  color: #ffc107;
}

section ul {
  list-style-type: disc;
  padding-left: 20px;
}
section p,
section ul {
  font-size: 14px;
  color: #fff;
}
</style>

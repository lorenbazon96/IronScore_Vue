<template>
  <div class="competitions-container">
    <aside class="sidebar">
      <div class="logo">
        <img src="@/assets/logo-t.png" alt="IronScore Logo" />
      </div>
      <div class="user-info">
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
        <router-link to="/communityfr" class="menu-item">Community</router-link>
      </nav>
    </aside>

    <main class="competitions-content container-fluid">
      <header class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="text-warning fw-bold text-uppercase">Competitions</h2>
        <router-link
          to="/"
          class="btn btn-link text-warning fw-bold p-0 logout-link"
          >Log Out</router-link
        >
      </header>

      <section>
        <h3
          class="d-flex text-white text-uppercase fw-bold mb-3 align-items-start"
        >
          Create New Competition
        </h3>
        <div class="row justify-content-center">
          <div class="col-md-10">
            <div class="card text-white p-4 border border-secondary">
              <form>
                <div class="mb-3">
                  <label for="name" class="form-label d-flex align-items-start"
                    >Name of competition:</label
                  >
                  <input
                    type="text"
                    class="form-control bg-dark text-white border-secondary"
                    id="name"
                    placeholder="Arnold Classic"
                  />
                </div>

                <div class="mb-3">
                  <label for="date" class="form-label d-flex align-items-start"
                    >Date</label
                  >
                  <input
                    type="date"
                    class="form-control bg-dark text-white border-secondary"
                    id="date"
                    value="2025-05-02"
                  />
                </div>

                <div class="mb-3">
                  <label
                    for="location"
                    class="form-label d-flex align-items-start"
                    >Location</label
                  >
                  <input
                    type="text"
                    class="form-control bg-dark text-white border-secondary"
                    id="location"
                    placeholder="London"
                  />
                </div>
                <div class="mb-3">
                  <label
                    for="referee"
                    class="form-label d-flex align-items-start"
                    >Referee</label
                  >
                  <input
                    type="text"
                    class="form-control bg-dark text-white border-secondary"
                    id="referee"
                    placeholder="Referee 1"
                  />
                  <input
                    type="text"
                    class="form-control bg-dark text-white border-secondary"
                    id="referee"
                    placeholder="Referee 2"
                  />
                  <input
                    type="text"
                    class="form-control bg-dark text-white border-secondary"
                    id="referee"
                    placeholder="Referee 3"
                  />
                  <input
                    type="text"
                    class="form-control bg-dark text-white border-secondary"
                    id="referee"
                    placeholder="Referee 4"
                  />
                  <input
                    type="text"
                    class="form-control bg-dark text-white border-secondary"
                    id="referee"
                    placeholder="Referee 5"
                  />
                  <input
                    type="text"
                    class="form-control bg-dark text-white border-secondary"
                    id="referee"
                    placeholder="Referee 6"
                  />
                  <input
                    type="text"
                    class="form-control bg-dark text-white border-secondary"
                    id="referee"
                    placeholder="Referee 7"
                  />
                  <input
                    type="text"
                    class="form-control bg-dark text-white border-secondary"
                    id="referee"
                    placeholder="Referee 8"
                  />
                  <input
                    type="text"
                    class="form-control bg-dark text-white border-secondary"
                    id="referee"
                    placeholder="Referee 9"
                  />
                  <input
                    type="text"
                    class="form-control bg-dark text-white border-secondary"
                    id="referee"
                    placeholder="Referee 10"
                  />
                </div>

                <div class="mb-3">
                  <label for="info" class="form-label d-flex align-items-start"
                    >More information</label
                  >
                  <textarea
                    class="form-control bg-dark text-white border-secondary"
                    id="info"
                    rows="3"
                    placeholder="competition categories, conditions, course of the competition, time of award ceremony,..."
                  ></textarea>
                </div>

                <button type="submit" class="btn btn-warning w-100 fw-bold">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Ncompetitions from "@/components/Ncompetitions.vue";

export default {
  name: "Ncompetitions",
  components: {
    Ncompetitions,
  },
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

input::placeholder,
textarea::placeholder {
  color: #bbb;
}

.card {
  background-color: rgb(17, 17, 17);
}

.edit {
  color: #ffc107;
}
</style>

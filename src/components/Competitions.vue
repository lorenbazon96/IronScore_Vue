<template>
  <div class="container-fluid">
    <div class="row min-vh-100">
      <aside class="col-12 col-md-3 bg-dark text-white p-3">
        <div class="logo mb-3">
          <img
            src="@/assets/logo-t.png"
            alt="IronScore Logo"
            class="img-fluid"
          />
        </div>
        <div class="user-info mb-3 border-top pt-2">
          <router-link to="/edit-account" class="edit d-block mb-2"
            >Edit Account</router-link
          >
          <p><strong>Name:</strong> {{ userStore.name }}</p>
          <p><strong>Surname:</strong> {{ userStore.surname }}</p>
          <p><strong>Email:</strong> {{ userStore.email }}</p>
          <p><strong>Age:</strong> {{ userStore.age }}</p>
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

      <main
        class="competitions-content col-12 col-md-9 p-4 bg-black text-white"
      >
        <header
          class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 text-warning text-uppercase fw-bold"
        >
          <h2 class="title mb-2 mb-md-0">Competitions</h2>
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
            My Results
          </h3>
          <div class="row g-4">
            <div class="col-md-8">
              <div class="card bg-white text-black">
                <div class="card-body">
                  <div
                    class="d-flex justify-content-between align-items-start border-bottom py-2"
                  >
                    <div class="d-flex align-items-start">
                      <span class="me-2 text-warning">⭐</span>
                      <div>
                        <strong>Arnold Classic 2024</strong><br />
                        <small
                          >Date: 3. ožujka 2024.<br />Location: Columbus, Ohio,
                          SAD</small
                        >
                      </div>
                    </div>
                    <div class="text-warning fw-bold">🏆 5</div>
                  </div>

                  <div
                    class="d-flex justify-content-between align-items-start border-bottom py-2"
                  >
                    <div class="d-flex align-items-start">
                      <span class="me-2 text-warning">⭐</span>
                      <div>
                        <strong>IFBB Europsko prvenstvo 2024</strong><br />
                        <small
                          >Date: 1. svibnja 2024.<br />Location: Santa Susanna,
                          Španjolska</small
                        >
                      </div>
                    </div>
                    <div class="text-warning fw-bold">🏆 3</div>
                  </div>

                  <div
                    class="d-flex justify-content-between align-items-start border-bottom py-2"
                  >
                    <div class="d-flex align-items-start">
                      <span class="me-2 text-warning">⭐</span>
                      <div>
                        <strong>IBFF Svjetsko prvenstvo 2024</strong><br />
                        <small
                          >Date: 5. listopada 2024.<br />Location: Koper,
                          Slovenia</small
                        >
                      </div>
                    </div>
                    <div class="text-warning fw-bold">🏆 15</div>
                  </div>

                  <hr class="border-secondary" />

                  <div class="d-flex align-items-start border-bottom py-2">
                    <span class="me-2 text-secondary">☆</span>
                    <div>
                      <strong>Arnold Classic 2025</strong><br />
                      <small
                        >Date: 2. ožujka 2025.<br />Location: Columbus, Ohio,
                        SAD</small
                      >
                    </div>
                  </div>

                  <div class="d-flex align-items-start py-2">
                    <span class="me-2 text-secondary">☆</span>
                    <div>
                      <strong
                        >Europsko prvenstvo u bodybuildingu i fitnessu
                        2025</strong
                      ><br />
                      <small
                        >Date: 5. svibnja 2025.<br />Location: Santa Susanna,
                        Španjolska</small
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card bg-black text-center text-white py-4">
                <div class="fs-1">
                  <img
                    src="@/assets/trophy.png"
                    alt="trophy"
                    class="trophy-img"
                  />
                </div>
                <div class="mt-3">
                  <router-link
                    to="/ncompetitions"
                    class="btn btn-warning fw-bold"
                    >Create new competition</router-link
                  >
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user";
export default {
  name: "Competitions",
  data() {
    return {};
  },
  computed: {
    userStore() {
      return useUserStore();
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

.competitions-content {
  flex: 1;
  padding: 30px;
  background: #000;
  overflow-y: auto;
}

.title {
  font-weight: bold;
}

.logout-link {
  color: #ffc107 !important;
  font-size: 14px;
  text-transform: uppercase;
}

.trophy-img {
  width: 10em;
  height: auto;
  margin-bottom: 20px;
}

.edit {
  color: #ffc107;
}
</style>

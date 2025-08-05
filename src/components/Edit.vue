<template>
  <div class="container-fluid">
    <div class="row min-vh-100">
      <aside class="sidebar col-12 col-md-3 bg-dark text-white p-3">
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
          <router-link to="/trainings" class="menu-item">Trainings</router-link>
        </nav>
      </aside>

      <main class="edit-content col-12 col-md-9 p-4 bg-black text-white">
        <header
          class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 text-warning text-uppercase fw-bold"
        >
          <h2 class="mb-2 mb-md-0 title">Edit Account</h2>
          <router-link
            to="/"
            class="btn btn-link text-warning fw-bold p-0 logout-link"
            >Log Out</router-link
          >
        </header>

        <section>
          <div class="row justify-content-center">
            <div class="col-md-10">
              <div class="card text-white p-4 border border-secondary">
                <form>
                  <div class="mb-3">
                    <label for="name" class="form-label">Name:</label>
                    <input
                      type="text"
                      class="form-control bg-dark text-white border-secondary"
                      id="name"
                      placeholder="Example"
                    />
                  </div>

                  <div class="mb-3">
                    <label for="surname" class="form-label">Surname:</label>
                    <input
                      type="text"
                      class="form-control bg-dark text-white border-secondary"
                      id="surname"
                      placeholder="Example"
                    />
                  </div>

                  <div class="mb-3">
                    <label for="mail" class="form-label">Email:</label>
                    <input
                      type="text"
                      class="form-control bg-dark text-white border-secondary"
                      id="mail"
                      placeholder="example@gmail.com"
                    />
                  </div>

                  <div class="mb-3">
                    <label for="age" class="form-label">Age:</label>
                    <input
                      type="text"
                      class="form-control bg-dark text-white border-secondary"
                      id="age"
                      placeholder="25"
                    />
                  </div>

                  <div class="mb-3">
                    <label for="type" class="form-label">Account type:</label>
                    <input
                      type="text"
                      class="form-control bg-dark text-white border-secondary"
                      id="type"
                      placeholder="Regular"
                    />
                  </div>

                  <button type="submit" class="btn btn-warning w-100 fw-bold">
                    Change
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: "Edit",
  data() {
    return {};
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

.edit-content {
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

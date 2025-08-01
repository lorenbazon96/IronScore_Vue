<template>
  <div class="edit-container">
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
        <p><strong>Account type:</strong> Referee</p>
      </div>
      <nav class="menu">
        <router-link to="/competitionsr" class="menu-item"
          >competitions</router-link
        >
        <router-link to="/communityfr" class="menu-item">Community</router-link>
      </nav>
    </aside>

    <main class="edit-content container-fluid">
      <header class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="text-warning fw-bold text-uppercase">Edit Account</h2>
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
                  <label for="name" class="form-label d-flex align-items-start"
                    >Name:</label
                  >
                  <input
                    type="text"
                    class="form-control bg-dark text-white border-secondary"
                    id="name"
                    placeholder="Example"
                  />
                </div>

                <div class="mb-3">
                  <label
                    for="surname"
                    class="form-label d-flex align-items-start"
                    >Surname:</label
                  >
                  <input
                    type="text"
                    class="form-control bg-dark text-white border-secondary"
                    id="surname"
                    placeholder="Example"
                  />
                </div>

                <div class="mb-3">
                  <label for="mail" class="form-label d-flex align-items-start"
                    >Email:</label
                  >
                  <input
                    type="text"
                    class="form-control bg-dark text-white border-secondary"
                    id="mail"
                    placeholder="example@gmail.com"
                  />
                </div>

                <div class="mb-3">
                  <label for="age" class="form-label d-flex align-items-start"
                    >Age:</label
                  >
                  <input
                    type="text"
                    class="form-control bg-dark text-white border-secondary"
                    id="age"
                    placeholder="25"
                  />
                </div>

                <div class="mb-3">
                  <label for="type" class="form-label d-flex align-items-start"
                    >Account type:</label
                  >
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
</template>

<script>
import EditR from "@/components/EditR.vue";

export default {
  name: "EditR",
  components: {
    EditR,
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.edit-container {
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

.edit-content {
  flex: 1;
  padding: 30px;
  background: #000;
  overflow-y: auto;
}

.edit-header {
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

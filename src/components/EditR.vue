<template>
  <div class="container-fluid">
    <div class="row min-vh-100">
      <aside class="sidebar col-12 col-md-3 bg-dark text-white p-3">
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
          <router-link to="/competitionsr" class="menu-item"
            >competitions</router-link
          >
          <router-link to="/communityfr" class="menu-item"
            >Community</router-link
          >
        </nav>
      </aside>

      <main class="edit-content col-12 col-md-9 p-4 bg-black text-white">
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
                    <label
                      for="name"
                      class="form-label d-flex align-items-start"
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
                    <label
                      for="mail"
                      class="form-label d-flex align-items-start"
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
                    <label
                      for="type"
                      class="form-label d-flex align-items-start"
                      >Account type:</label
                    >
                    <input
                      type="text"
                      class="form-control bg-dark text-white border-secondary"
                      id="type"
                      placeholder="Regular"
                      disabled
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
  name: "EditR",
  data() {
    return {
      name: "",
      surname: "",
      email: "",
      age: "",
      type: "",
    };
  },
  async mounted() {
    const user = auth.currentUser;
    if (!user) {
      console.warn("Korisnik nije prijavljen.");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        this.name = data.name || "";
        this.surname = data.surname || "";
        this.email = data.email || "";
        this.age = data.age || "";
        this.type = data.type || "";
      }
    } catch (err) {
      console.error("Greška pri dohvaćanju podataka:", err.message);
    }
  },
  methods: {
    async updateUserData(e) {
      e.preventDefault();

      const user = auth.currentUser;
      if (!user) {
        alert("Nema prijavljenog korisnika.");
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const existingDoc = await getDoc(docRef);
        let existingRole = "regular";

        if (existingDoc.exists()) {
          const existingData = existingDoc.data();
          existingRole = existingData.role || "regular";
        }

        if (this.email !== user.email) {
          await updateEmail(user, this.email);
        }

        await setDoc(
          docRef,
          {
            name: this.name,
            surname: this.surname,
            email: this.email,
            age: this.age,
            type: this.type,
          },
          { merge: true }
        );

        alert("Podaci uspješno ažurirani.");
      } catch (error) {
        console.error("Greška pri spremanju:", error.message);
        alert("Greška: " + error.message);
      }
    },

    async sendVerificationEmail() {
      const user = auth.currentUser;
      if (user) {
        try {
          await sendEmailVerification(user);
          alert("Verifikacijski email poslan.");
        } catch (err) {
          console.error("Greška kod slanja verifikacije:", err.message);
        }
      }
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

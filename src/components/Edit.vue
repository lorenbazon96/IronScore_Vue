<template>
  <div class="container-fluid">
    <div class="row min-vh-100">
      <aside class="sidebar col-12 col-md-3 bg-darka text-white p-3">
        <div class="logo mb-3">
          <img
            src="@/assets/logo-t.png"
            alt="IronScore Logo"
            class="img-fluid"
          />
        </div>
        <div class="user-info mb-3 border-top pt-2">
          <router-link to="/edit-account" class="edit"
            >Edit Account</router-link
          >
          <p><strong>Name:</strong> {{ name }}</p>
          <p><strong>Surname:</strong> {{ surname }}</p>

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
                <form @submit="updateUserData">
                  <div class="mb-3">
                    <label for="name" class="form-label">Name:</label>
                    <input
                      v-model="name"
                      type="text"
                      class="form-control bg-dark text-white border-secondary"
                      id="name"
                      placeholder="Example"
                    />
                  </div>

                  <div class="mb-3">
                    <label for="surname" class="form-label">Surname:</label>
                    <input
                      v-model="surname"
                      type="text"
                      class="form-control bg-dark text-white border-secondary"
                      id="surname"
                      placeholder="Example"
                    />
                  </div>

                  <div class="mb-3">
                    <label for="mail" class="form-label">Email:</label>
                    <input
                      v-model="email"
                      type="text"
                      class="form-control bg-dark text-white border-secondary"
                      id="mail"
                      placeholder="example@gmail.com"
                    />
                  </div>

                  <div class="mb-3">
                    <label for="age" class="form-label">Age:</label>
                    <input
                      v-model="age"
                      type="text"
                      class="form-control bg-dark text-white border-secondary"
                      id="age"
                      placeholder="25"
                    />
                  </div>

                  <div class="mb-3">
                    <label for="type" class="form-label">Account type:</label>
                    <input
                      v-model="type"
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
import { db, auth } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateEmail, sendEmailVerification } from "firebase/auth";
import { useRouter } from "vue-router";

export default {
  name: "Edit",
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
  setup() {
    const router = useRouter();

    router.afterEach((to, from) => {
      if (to.fullPath !== from.fullPath) {
        window.location.reload();
      }
    });
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

.bg-darka {
  background-color: #000 !important;
}
</style>

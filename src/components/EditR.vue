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
          <div
            class="user-info-inner d-flex justify-content-between align-items-center mt-2"
          >
            <div class="d-flex align-items-center">
              <img src="@/assets/user.png" alt="User" class="user-icon me-2" />
              <span class="fw-bold user-name"> {{ name }} {{ surname }} </span>
            </div>

            <router-link
              to="/edit-r-account"
              class="settings-link d-flex align-items-center"
            >
              <img
                src="@/assets/setting1.png"
                alt="Settings"
                class="settings-icon"
              />
            </router-link>
          </div>
        </div>

        <nav class="menu d-flex flex-column gap-2">
          <router-link to="/competitionsr" class="menu-item">
            competitions
          </router-link>
          <router-link to="/communityfr" class="menu-item">
            Community
          </router-link>
        </nav>
      </aside>

      <main class="edit-content col-12 col-md-9 bg-black text-white">
        <header
          class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4"
        >
          <div>
            <h2 class="title text-warning fw-bold text-uppercase mb-1">
              Edit account
            </h2>
            <p class="subtitle mb-0">
              Update your referee profile information.
            </p>
          </div>

          <router-link
            to="/"
            class="btn btn-link text-warning fw-bold p-0 logout-link d-flex align-items-center"
          >
            <img
              src="@/assets/logout.png"
              alt="Logout"
              class="logout-icon me-2"
            />
            Log Out
          </router-link>
        </header>

        <section class="edit-section">
          <div class="row justify-content-center">
            <div class="col-lg-8 col-md-10">
              <div class="card edit-card text-white">
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <h5 class="mb-0 text-uppercase small">Referee details</h5>
                  <span class="badge bg-warning text-dark text-uppercase">
                    {{ type || "Referee" }}
                  </span>
                </div>

                <form @submit.prevent="updateUserData">
                  <div class="row g-3">
                    <div class="col-12 col-md-6">
                      <label for="name" class="form-label"> Name </label>
                      <input
                        v-model="name"
                        type="text"
                        class="form-control bg-dark text-white border-secondary"
                        id="name"
                        placeholder="Example"
                      />
                    </div>

                    <div class="col-12 col-md-6">
                      <label for="surname" class="form-label"> Surname </label>
                      <input
                        v-model="surname"
                        type="text"
                        class="form-control bg-dark text-white border-secondary"
                        id="surname"
                        placeholder="Example"
                      />
                    </div>

                    <div class="col-12 col-md-6">
                      <label for="mail" class="form-label"> Email </label>
                      <input
                        v-model="email"
                        type="email"
                        class="form-control bg-dark text-white border-secondary"
                        id="mail"
                        placeholder="example@gmail.com"
                      />
                    </div>

                    <div class="col-12 col-md-6">
                      <label for="age" class="form-label"> Age </label>
                      <input
                        v-model="age"
                        type="number"
                        class="form-control bg-dark text-white border-secondary"
                        id="age"
                        min="0"
                        placeholder="25"
                      />
                    </div>

                    <div class="col-12">
                      <label
                        for="type"
                        class="form-label d-flex align-items-center"
                      >
                        Account type
                        <span class="badge bg-secondary ms-2 small">
                          referee · read only
                        </span>
                      </label>
                      <input
                        v-model="type"
                        type="text"
                        class="form-control bg-dark text-white border-secondary"
                        id="type"
                        placeholder="Referee"
                        disabled
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    class="btn btn-warning w-100 fw-bold mt-4 text-uppercase"
                  >
                    Save changes
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
        this.type = data.type ?? "referee";
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
    async updateUserData() {
      const user = auth.currentUser;
      if (!user) {
        alert("Nema prijavljenog korisnika.");
        return;
      }

      try {
        if (this.email !== user.email) {
          await updateEmail(user, this.email);
        }

        const docRef = doc(db, "users", user.uid);
        await setDoc(
          docRef,
          {
            name: this.name,
            surname: this.surname,
            email: this.email,
            age: this.age,
            type: "referee",
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
  padding: 10px 15px 0 15px;
}

.user-info-inner {
  max-width: 260px;
  margin: 0 auto;
}

.user-icon {
  width: 28px;
  height: 28px;
}

.settings-icon {
  width: 22px;
  height: 22px;
}

.settings-link {
  color: #ffc107;
  text-decoration: none;
}

.settings-link:hover .settings-icon {
  transform: scale(1.05);
}

.user-name {
  font-size: 16px;
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
  letter-spacing: 0.04em;
}

.subtitle {
  font-size: 0.85rem;
}

.logout-link {
  color: #ffc107 !important;
  font-size: 14px;
  text-transform: uppercase;
  text-decoration: none;
}

.logout-icon {
  width: 20px;
  height: 20px;
}

.edit-section {
  margin-top: 10px;
}

.edit-card {
  background-color: #111;
  border-radius: 16px;
  border: 1px solid #333;
  padding: 20px 24px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
}

.edit-card .form-label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #bbb;
}

.edit-card .form-control {
  font-size: 0.95rem;
}

input::placeholder,
textarea::placeholder {
  color: #777;
}

.btn.btn-warning {
  background-color: #ffc107;
  color: #000;
  border: none;
  border-radius: 999px;
  padding: 10px 16px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.btn.btn-warning:hover {
  background-color: #ffcd39;
}

.card {
  background-color: rgb(17, 17, 17);
}

.bg-darka {
  background-color: #000 !important;
}
</style>

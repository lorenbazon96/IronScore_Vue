<template>
  <div class="register-container">
    <div class="back-arrow" @click="goBack">
      <img src="@/assets/home.png" alt="Back" class="arrow-img" />
    </div>

    <div class="logo-section">
      <img src="@/assets/logo.png" alt="Ironscore Logo" class="logo" />
    </div>

    <div class="form-section">
      <div class="input-wrapper">
        <img src="@/assets/email.png" alt="Email" class="input-icon" />
        <input
          type="email"
          v-model="email"
          placeholder="Your mail"
          class="input-field input-with-icon"
        />
      </div>

      <div class="input-wrapper">
        <img src="@/assets/password.png" alt="Password" class="input-icon" />
        <input
          type="password"
          v-model="password"
          placeholder="Your password"
          class="input-field input-with-icon"
        />
      </div>

      <select v-model="userType" class="input-field">
        <option disabled value="">Type of user</option>
        <option value="regular">Regular</option>
        <option value="referee">Referee</option>
      </select>

      <!-- EXTRA INPUT SAMO ZA SUCA -->
      <div v-if="userType === 'referee'" class="input-wrapper">
        <input
          type="text"
          v-model="refereeCode"
          placeholder="Referee registration code"
          class="input-field"
        />

        <!-- helper tekst (možeš maknuti u produkciji) 
        <small class="helper-text">
          For testing, use code: <strong>{{ refereeSecret }}</strong>
        </small>-->

        <!-- error poruka -->
        <p v-if="showRefereeError" class="error-text">
          Pogrešan kod za registraciju suca.
        </p>
      </div>

      <button
        type="button"
        class="register-button sirina-b d-flex align-items-center justify-content-center"
        @click="register"
        :disabled="!canSubmit"
      >
        <img src="@/assets/new.png" alt="Register" class="btn-icon me-2" />
        Register
      </button>
    </div>
  </div>
</template>

<script>
import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export default {
  name: "Register",
  data() {
    return {
      email: "",
      password: "",
      userType: "",
      refereeCode: "",
      refereeSecret: "IRONREF2025", // ⇐ OVDJE JE TA TVOJA "FIKSNA RIJEČ"
    };
  },
  computed: {
    isRefereeCodeValid() {
      if (this.userType !== "referee") return true;
      return this.refereeCode.trim() === this.refereeSecret;
    },
    showRefereeError() {
      // prikazujemo error samo kad korisnik nešto upiše, a nije ispravno
      return (
        this.userType === "referee" &&
        this.refereeCode.trim() !== "" &&
        !this.isRefereeCodeValid
      );
    },
    canSubmit() {
      // osnovna provjera praznih polja
      if (!this.email || !this.password || !this.userType) return false;

      // regular user – nema dodatnih uvjeta
      if (this.userType === "regular") return true;

      // referee – kod mora biti ispravan
      if (this.userType === "referee") {
        return this.isRefereeCodeValid;
      }

      return false;
    },
  },
  methods: {
    async register() {
      if (!this.userType) {
        alert("Odaberi tip korisnika!");
        return;
      }

      // sigurnosna provjera i na submitu (iako je button već disabled ako nije ispravno)
      if (!this.canSubmit) {
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          email: this.email,
          role: this.userType,
          createdAt: new Date(),
        });

        console.log("Uspješna registracija i spremanje podataka");

        this.$router.push({ name: "login" });
      } catch (error) {
        console.error("Došlo je do greške:", error.message);
        alert("Greška pri registraciji: " + error.message);
      }
    },

    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: black;
  height: 100vh;
  padding: 20px;
  position: relative;
}

.back-arrow {
  position: absolute;
  top: 30px;
  left: 30px;
  cursor: pointer;
}

.arrow-img {
  width: 60px;
  height: 60px;
}

.logo-section {
  text-align: center;
  margin-top: 50px;
}

.logo {
  width: 70%;
  height: auto;
}

.form-section {
  margin-top: 40px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
}

.input-field {
  background-color: #d3d3d3;
  border: none;
  border-radius: 5px;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 16px;
  width: 100%;
}

.input-field:focus {
  outline: none;
}

.register-button {
  background-color: #ffc107;
  color: #303030;
  font-weight: bold;
  border-radius: 5px;
  font-size: 15px;
  padding: 14px;
}

.register-button:hover {
  background-color: #e0a800;
  color: #000;
}

.register-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sirina-b {
  width: 100%;
  padding: 1em;
  margin-top: 5px;
}

@media (max-width: 477.98px) {
  .arrow-img {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 350.98px) {
  .arrow-img {
    width: 40px !important;
    height: 40px !important;
  }
}

.input-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.input-with-icon {
  padding-left: 42px;
  margin-bottom: 1px;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  object-fit: contain;
  pointer-events: none;
  filter: brightness(0.7);
}

.btn-icon {
  width: 25px;
  height: 25px;
  object-fit: contain;
  filter: brightness(0.85);
}

.helper-text {
  display: block;
  font-size: 12px;
  color: #bbbbbb;
  margin-top: 4px;
}

.error-text {
  margin-top: 4px;
  font-size: 13px;
  color: #ff4d4f;
}
</style>

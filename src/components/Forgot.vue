<template>
  <div class="login-container">
    <div class="back-arrow" @click="goBack">
      <img src="@/assets/home.png" alt="Home" class="arrow-img" />
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

      <button class="login-button sirina-b" @click="send">
        <img src="@/assets/login.png" alt="Send" class="btn-icon mx-2" />
        Send
      </button>
    </div>
  </div>
</template>

<script>
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

export default {
  name: "ForgotPassword",
  data() {
    return {
      email: "",
    };
  },
  methods: {
    async send() {
      if (!this.email) {
        alert("Molimo unesite email.");
        return;
      }
      try {
        await sendPasswordResetEmail(auth, this.email);
        alert("Email za resetiranje lozinke je poslan.");
        this.email = "";
      } catch (error) {
        console.error("Greška pri slanju emaila:", error.message);
        alert("Greška: " + error.message);
      }
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.login-container {
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

.input-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.input-field {
  background-color: #d3d3d3;
  border: none;
  border-radius: 5px;
  padding: 12px;
  font-size: 16px;
  width: 100%;
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

.login-button {
  background-color: #ffc107;
  color: #303030;
  font-weight: bold;
  border-radius: 5px;
  font-size: 15px;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.login-button:hover {
  background-color: #e0a800;
  color: #000;
}

.sirina-b {
  width: 100%;
  padding: 1em;
  margin-top: 5px;
}

.btn-icon {
  width: 25px;
  height: 25px;
  object-fit: contain;
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
</style>

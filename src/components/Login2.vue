<template>
  <div class="login-container">
    <div class="back-arrow" @click="goBack">
      <img
        src="@/assets/left-arrow-back-svgrepo-com.svg"
        alt="Back"
        class="arrow-img"
      />
    </div>
    <div class="logo-section">
      <img src="@/assets/logo.png" alt="Ironscore Logo" class="logo" />
    </div>
    <div class="form-section">
      <input
        type="email"
        v-model="email"
        placeholder="Your mail"
        class="input-field"
      />
      <input
        type="password"
        v-model="password"
        placeholder="Your password"
        class="input-field"
      />
      <div class="forgot-password" @click="forgotPassword">
        Forgot password?
      </div>
      <button class="login-button sirina-b" @click="login">Log In</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      console.log("Logging in with:", this.email, this.password);
    },
    forgotPassword() {
      console.log("Forgot password clicked");
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

.input-field {
  background-color: #d3d3d3;
  border: none;
  border-radius: 5px;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 16px;
}

.forgot-password {
  color: white;
  font-size: 14px;
  text-align: right;
  margin-bottom: 20px;
  cursor: pointer;
}

.login-button {
  background-color: #ffc107;
  color: #303030;
  font-weight: bold;
  border-radius: 5px;
  font-size: 15px;
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
</style>

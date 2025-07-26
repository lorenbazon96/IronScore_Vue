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
      <button class="login-button sirina-b" @click="send">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
    };
  },
  methods: {
    send() {
      console.log("We need new pass for:", this.email);
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

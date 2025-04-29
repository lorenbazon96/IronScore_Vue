<template>
  <div class="register-container">
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
      <select v-model="userType" class="input-field">
        <option disabled value="">Type of user</option>
        <option value="regular">Regular</option>
        <option value="referee">Referee</option>
      </select>
      <button class="register-button sirina-b" @click="register">
        Register
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      email: "",
      password: "",
      userType: "",
    };
  },
  methods: {
    register() {
      console.log(
        "Registering with:",
        this.email,
        this.password,
        this.userType
      );
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

.sirina-b {
  width: 100%;
  padding: 1em;
  margin-top: 5px;
}
</style>

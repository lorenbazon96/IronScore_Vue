<template>
  <div class="policy-container">
    <div class="back-arrow" @click="goBack">
      <img
        src="@/assets/left-arrow-back-svgrepo-com.svg"
        alt="Back"
        class="arrow-img"
      />
    </div>
    <div class="logo-section">
      <img src="@/assets/logo.png" alt="IronScore Logo" class="logo" />
    </div>
    <div class="policy-content">
      <h1 class="policy-title">Privacy Policy</h1>
      <div class="policy-text">
        <p><strong>1. What Data We Collect</strong></p>
        <p>We collect your name, email, and password during registration, along with your activity in the app (workouts, competitions, ratings), and technical data such as IP address and device info.</p>

        <p><strong>2. How We Use the Data</strong></p>
        <p>We use your data to provide services, personalize your experience, contact you (e.g. notifications), and for analytics and improvement of the app.</p>

        <p><strong>3. Data Sharing</strong></p>
        <p>We do not share your personal information with third parties without your consent unless required by law.</p>

        <p><strong>4. Storage and Security</strong></p>
        <p>We store data on secure servers and use encryption and security measures to protect your information.</p>

        <p><strong>5. Your Rights</strong></p>
        <p>You can request access to, correction of, or deletion of your personal data. Contact us via in-app support for assistance.</p>

        <p><strong>6. Cookies and Tracking</strong></p>
        <p>The app may use cookies and similar technologies to enhance user experience and collect analytics data.</p>

        <p><strong>7. Changes to the Policy</strong></p>
        <p>We may update this Privacy Policy occasionally. Users will be notified of significant changes.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PrivacyPolicy",
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.policy-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: black;
  color: white;
  min-height: 100vh;
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
  max-width: 250px;
  height: auto;
}

.policy-content {
  max-width: 800px;
  margin-top: 30px;
  padding: 20px;
}

.policy-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.policy-text p {
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 15px;
}

@media (max-width: 768px) {
  .arrow-img {
    width: 50px;
    height: 50px;
  }

  .policy-title {
    font-size: 22px;
  }

  .policy-text p {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .arrow-img {
    width: 40px;
    height: 40px;
  }

  .policy-title {
    font-size: 20px;
  }

  .policy-text {
    padding: 10px;
  }

  .policy-text p {
    font-size: 14px;
  }
}
</style>

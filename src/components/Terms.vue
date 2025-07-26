<template>
  <div class="terms-container">
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
    <div class="terms-content">
      <h1 class="terms-title">Terms of Use</h1>
      <div class="terms-text">
        <p><strong>1. General Provisions</strong></p>
        <p>
          These Terms of Use govern your use of the IronScore application. By
          using the application, you agree to these terms in full.
        </p>

        <p><strong>2. Registration and User Account</strong></p>
        <p>
          Users are responsible for the accuracy of the information provided
          during registration. Sharing login credentials is strictly prohibited.
        </p>

        <p><strong>3. Use of Content</strong></p>
        <p>
          All content (workouts, competitions, results, images) is intended for
          personal and non-commercial use only. Copying or redistributing
          content without permission is forbidden.
        </p>

        <p><strong>4. User Conduct</strong></p>
        <p>
          Posting offensive, false, sexually explicit, threatening, or illegal
          content is prohibited.
        </p>

        <p><strong>5. Competitions and Rankings</strong></p>
        <p>
          By participating in competitions, you agree that your results may be
          visible to others and listed on the leaderboard.
        </p>

        <p><strong>6. Account Termination</strong></p>
        <p>
          IronScore reserves the right to suspend or delete a user account for
          violations of these terms, without prior notice.
        </p>

        <p><strong>7. Disclaimer of Liability</strong></p>
        <p>
          IronScore is not liable for injuries, incorrect information, or any
          damages resulting from use of the app or its content.
        </p>

        <p><strong>8. Changes to Terms</strong></p>
        <p>
          We reserve the right to modify these Terms of Use at any time. Users
          will be notified of significant changes via the app.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TermsOfUse",
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.terms-container {
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

.terms-content {
  max-width: 800px;
  margin-top: 30px;
  padding: 20px;
}

.terms-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.terms-text p {
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 15px;
}

@media (max-width: 768px) {
  .arrow-img {
    width: 50px;
    height: 50px;
  }

  .terms-title {
    font-size: 22px;
  }

  .terms-text p {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .arrow-img {
    width: 40px;
    height: 40px;
  }

  .terms-title {
    font-size: 20px;
  }

  .terms-text {
    padding: 10px;
  }

  .terms-text p {
    font-size: 14px;
  }
}
</style>

<template>
  <div class="terms-page">
    <button class="back-arrow" type="button" @click="goBack">
      <img
        src="@/assets/left-arrow-back-svgrepo-com.svg"
        alt="Back"
        class="arrow-img"
      />
    </button>

    <div class="terms-wrapper">
      <div class="logo-section">
        <img src="@/assets/logo-t.png" alt="IronScore Logo" class="logo" />
      </div>

      <div class="terms-card">
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
            during registration. Sharing login credentials is strictly
            prohibited.
          </p>

          <p><strong>3. Use of Content</strong></p>
          <p>
            All content (workouts, competitions, results, images) is intended
            for personal and non-commercial use only. Copying or redistributing
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
.terms-page {
  min-height: 100vh;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #222 0, #000 55%, #000 100%);
  color: #ffffff;
  position: relative;
}

.back-arrow {
  position: absolute;
  top: 24px;
  left: 24px;
  cursor: pointer;
  border: none;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 999px;
  padding: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}

.back-arrow:hover {
  background: rgba(255, 193, 7, 0.15);
  box-shadow: 0 0 12px rgba(255, 193, 7, 0.35);
  transform: translateX(-1px);
}

.arrow-img {
  width: 36px;
  height: 36px;
}

.terms-wrapper {
  max-width: 880px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-section {
  text-align: center;
  margin-bottom: 18px;
}

.logo {
  width: 220px;
  max-width: 70%;
  height: auto;
}

.terms-card {
  width: 100%;
  background: rgba(10, 10, 10, 0.95);
  border-radius: 18px;
  border: 1px solid #333;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.8);
  padding: 24px 22px 26px;
  max-height: calc(100vh - 170px);
  overflow-y: auto;
}

.terms-title {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 18px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #ffc107;
}

.terms-text p {
  font-size: 15px;
  line-height: 1.7;
  margin-bottom: 10px;
  color: #f5f5f5;
}

.terms-text p strong {
  display: block;
  margin-top: 10px;
  margin-bottom: 4px;
  color: #ffffff;
}

.terms-card::-webkit-scrollbar {
  width: 6px;
}
.terms-card::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 3px;
}
.terms-card::-webkit-scrollbar-track {
  background-color: #111;
}

@media (max-width: 768px) {
  .terms-page {
    padding: 16px;
  }

  .back-arrow {
    top: 16px;
    left: 16px;
  }

  .arrow-img {
    width: 30px;
    height: 30px;
  }

  .terms-card {
    padding: 18px 16px 20px;
    max-height: calc(100vh - 140px);
  }

  .terms-title {
    font-size: 22px;
  }

  .terms-text p {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .terms-page {
    padding: 12px;
  }

  .back-arrow {
    top: 12px;
    left: 12px;
  }

  .arrow-img {
    width: 26px;
    height: 26px;
  }

  .logo {
    width: 180px;
  }

  .terms-title {
    font-size: 20px;
  }

  .terms-text p {
    font-size: 13px;
  }
}
</style>

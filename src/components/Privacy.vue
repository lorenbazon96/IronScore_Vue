<template>
  <div class="policy-page">
    <button class="back-arrow" type="button" @click="goBack">
      <img
        src="@/assets/left-arrow-back-svgrepo-com.svg"
        alt="Back"
        class="arrow-img"
      />
    </button>

    <div class="policy-wrapper">
      <div class="logo-section">
        <img src="@/assets/logo-t.png" alt="IronScore Logo" class="logo" />
      </div>

      <div class="policy-card">
        <h1 class="policy-title">Privacy Policy</h1>

        <div class="policy-text">
          <p><strong>1. What Data We Collect</strong></p>
          <p>
            We collect your name, email, and password during registration, along
            with your activity in the app (workouts, competitions, ratings), and
            technical data such as IP address and device info.
          </p>

          <p><strong>2. How We Use the Data</strong></p>
          <p>
            We use your data to provide services, personalize your experience,
            contact you (e.g. notifications), and for analytics and improvement
            of the app.
          </p>

          <p><strong>3. Data Sharing</strong></p>
          <p>
            We do not share your personal information with third parties without
            your consent unless required by law.
          </p>

          <p><strong>4. Storage and Security</strong></p>
          <p>
            We store data on secure servers and use encryption and security
            measures to protect your information.
          </p>

          <p><strong>5. Your Rights</strong></p>
          <p>
            You can request access to, correction of, or deletion of your
            personal data. Contact us via in-app support for assistance.
          </p>

          <p><strong>6. Cookies and Tracking</strong></p>
          <p>
            The app may use cookies and similar technologies to enhance user
            experience and collect analytics data.
          </p>

          <p><strong>7. Changes to the Policy</strong></p>
          <p>
            We may update this Privacy Policy occasionally. Users will be
            notified of significant changes.
          </p>

          <p><strong>8. Customer Support</strong></p>
          <p>
            For questions about this Privacy Policy or any other support needs,
            contact us at
            <a :href="supportMailTo" class="support-link">
              {{ supportEmail }} </a
            >.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PrivacyPolicy",
  data() {
    return {
      supportEmail: "support@ironscore.app",
    };
  },
  computed: {
    supportMailTo() {
      const subject = "IronScore Support – Privacy Policy";
      return `mailto:${this.supportEmail}?subject=${encodeURIComponent(
        subject
      )}`;
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.policy-page {
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

.policy-wrapper {
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

.policy-card {
  width: 100%;
  background: rgba(10, 10, 10, 0.95);
  border-radius: 18px;
  border: 1px solid #333;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.8);
  padding: 24px 22px 26px;
  max-height: calc(100vh - 170px);
  overflow-y: auto;
}

.policy-title {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 18px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #ffc107;
}

.policy-text p {
  font-size: 15px;
  line-height: 1.7;
  margin-bottom: 10px;
  color: #f5f5f5;
}

.policy-text p strong {
  display: block;
  margin-top: 10px;
  margin-bottom: 4px;
  color: #ffffff;
}

.support-link {
  color: #ffc107;
  text-decoration: underline;
}
.support-link:hover {
  text-decoration: none;
}

.policy-card::-webkit-scrollbar {
  width: 6px;
}
.policy-card::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 3px;
}
.policy-card::-webkit-scrollbar-track {
  background-color: #111;
}

@media (max-width: 768px) {
  .policy-page {
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

  .policy-card {
    padding: 18px 16px 20px;
    max-height: calc(100vh - 140px);
  }

  .policy-title {
    font-size: 22px;
  }

  .policy-text p {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .policy-page {
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

  .policy-title {
    font-size: 20px;
  }

  .policy-text p {
    font-size: 13px;
  }
}
</style>

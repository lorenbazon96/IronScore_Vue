<template>
  <div
    class="container d-flex flex-column align-items-center justify-content-center min-vh-100 text-center"
  >
    <img src="@/assets/logo.png" alt="IronScore Logo" class="logo" />

    <div class="subtitle">YOUR ULTIMATE BODYBUILDING COMPANION!</div>
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-4">
          <div class="w-100 py-5 my-1">
            <router-link to="/login">
              <button
                class="btn btn-custom btn-lg sirina-b mb-3 d-flex align-items-center justify-content-center"
              >
                <img
                  src="@/assets/login.png"
                  alt="Log in"
                  class="btn-icon mx-2"
                />
                Log In Now
              </button>
            </router-link>

            <router-link to="/register">
              <button
                class="btn btn-custom btn-lg sirina-b mb-3 d-flex align-items-center justify-content-center"
              >
                <img
                  src="@/assets/new.png"
                  alt="Create account"
                  class="btn-icon mx-2"
                />
                Create an Account
              </button>
            </router-link>
          </div>
        </div>

        <div class="col-12 col-md-8 py-2">
          <div class="mt-2 py-1 text-start fw-bold velikaS">
            Whether you're an athlete, competitor, or judge, this app has
            everything you need:
          </div>
          <div class="feature-list mt-1">
            <div
              class="feature-item velikaS"
              v-for="feature in features"
              :key="feature.text"
            >
              <img :src="feature.icon" class="icon" />
              {{ feature.text }}
            </div>
          </div>

          <div class="mt-4 fw-bold velikaS">
            Start now and take your fitness journey to the next level!
          </div>
        </div>
      </div>
    </div>
    <div class="footer-text">
      By continuing, you agree to IronScore
      <router-link to="/terms-of-use"> Terms of Use</router-link> and confirm
      that you have read its
      <router-link to="/privacy-policy"> Privacy Policy</router-link>.
    </div>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
  data() {
    return {
      features: [
        {
          text: "Train smarter – create workouts, track progress, and set goals",
          icon: require("@/assets/brain-svgrepo-com.svg"),
        },
        {
          text: "Compete & rank – join competitions and check leaderboards",
          icon: require("@/assets/medal-sherif-badge-2-svgrepo-com.svg"),
        },
        {
          text: "Judge fairly – organize and score bodybuilding events",
          icon: require("@/assets/medal-badge-reward-svgrepo-com.svg"),
        },
        {
          text: "Connect & grow – join the community, share insights, and view athlete records",
          icon: require("@/assets/star-svgrepo-com.svg"),
        },
        {
          text: "Stay on time – use the built-in training timer for precise workouts",
          icon: require("@/assets/sand-clock-svgrepo-com.svg"),
        },
      ],
    };
  },
};
</script>

<style scoped>
body {
  background-color: #000;
  color: #fff;
  font-family: "Arial", sans-serif;
  text-align: center;
  padding: 30px 10px;
}
.logo {
  width: 40%;
  margin-bottom: 20px;
}
.title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 10px;
}
.subtitle {
  font-size: 20px;
  font-weight: bold;
  margin-top: -50px;
  margin-bottom: 30px;
}
.velikaS {
  text-transform: uppercase;
}
.btn-custom {
  background-color: #ffc107;
  color: #303030;
  font-weight: bold;
  border-radius: 5px;
  font-size: 15px;
}
.btn-g {
  font-weight: bold;
  border-radius: 5px;
  font-size: 15px;
  color: #303030;
}

.btn-custom:hover {
  background-color: #e0a800;
  color: #000;
}
.feature-list {
  text-align: left;
  max-width: 600px;
  margin: 30px auto;
  font-size: 16px;
  line-height: 1.7;
}
.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-family: system-ui !important;
  font-weight: 500;
}
.icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  flex-shrink: 0;
}
.footer-text {
  font-size: 12px;
  color: white;
}
a {
  color: #ffc107;
}
a:hover {
  color: #e0a800;
}
.sirina-b {
  width: 100%;
  padding: 1em;
  margin-top: 5px;
}
.my-6 {
  margin-top: 6em;
  margin-bottom: 6em;
}
@media (max-width: 1400.98px) {
  .subtitle {
    font-size: 16px;
    font-weight: bold;
    margin-top: -45px;
    margin-bottom: 30px;
  }
}

@media (max-width: 1200.98px) {
  .subtitle {
    font-size: 14px !important;
  }
}

@media (max-width: 992.98px) {
  .logo {
    width: 80% !important;
    margin-bottom: 5px !important;
  }

  .subtitle {
    font-size: 19px !important;
    margin-top: -30px !important;
    margin-bottom: 20px !important;
  }
}

@media (max-width: 767.98px) {
  .logo {
    width: 100% !important;
    margin-bottom: 30px !important;
  }

  .subtitle {
    font-size: 18px !important;
    margin-top: -55px !important;
  }
}

@media (max-width: 300.98px) {
  .subtitle {
    font-size: 11px !important;
    margin-top: -40px !important;
    margin-bottom: 30px !important;
  }
}

@media (max-width: 450.98px) {
  .subtitle {
    font-size: 14px !important;
    margin-top: -40px !important;
    margin-bottom: 30px !important;
  }

  .feature-list {
    font-size: 14px !important;
  }
}

.btn-icon {
  width: 25px;
  height: 25px;
  object-fit: contain;
}
</style>

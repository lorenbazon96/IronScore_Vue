import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/AboutView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/RegisterView.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/DashboardView.vue"),
  },
  {
    path: "/competitions",
    name: "competitions",
    component: () => import("@/views/CompetitionsView.vue"),
  },
  {
    path: "/ncompetitions",
    name: "ncompetitions",
    component: () => import("@/views/NcompetitionsView.vue"),
  },
  {
    path: "/goals",
    name: "goals",
    component: () => import("@/views/GoalsView.vue"),
  },
  {
    path: "/weight",
    name: "weight",
    component: () => import("@/views/WeightView.vue"),
  },
  {
    path: "/workouts",
    name: "workouts",
    component: () => import("@/views/WorkoutsView.vue"),
  },
  {
    path: "/bmi",
    name: "bmi",
    component: () => import("@/views/BmiView.vue"),
  },
  {
    path: "/community",
    name: "communityF",
    component: () => import("@/views/CommunityFView.vue"),
  },
  {
    path: "/trainings",
    name: "Training",
    component: () => import("@/views/TrainingView.vue"),
  },
  {
    path: "/new-training-daily",
    name: "TrainingD",
    component: () => import("@/views/TrainingDView.vue"),
  },
  {
    path: "/new-training-weekly",
    name: "TrainingW",
    component: () => import("@/views/TrainingWView.vue"),
  },
  {
    path: "/timer",
    name: "timer",
    component: () => import("@/views/TimerView.vue"),
  },
  {
    path: "/forgot-password",
    name: "Forgot",
    component: () => import("@/views/ForgotView.vue"),
  },
  {
    path: "/privacy-policy",
    name: "Privacy",
    component: () => import("@/views/PrivacyView.vue"),
  },
  {
    path: "/terms-of-use",
    name: "Terms",
    component: () => import("@/views/TermsView.vue"),
  },
  {
    path: "/edit-account",
    name: "Edit",
    component: () => import("@/views/EditView.vue"),
  },
  {
    path: "/competitionsr",
    name: "competitionsr",
    component: () => import("@/views/CompetitionsRView.vue"),
  },
  {
    path: "/competitionr",
    name: "competitionr",
    component: () => import("@/views/CompetitionRView.vue"),
  },
  {
    path: "/grade",
    name: "grade",
    component: () => import("@/views/GradeView.vue"),
  },
  {
    path: "/communityp",
    name: "community",
    component: () => import("@/views/CommunityView.vue"),
  },
  {
    path: "/communitypr",
    name: "communityr",
    component: () => import("@/views/CommunityRView.vue"),
  },
  {
    path: "/communityfr",
    name: "communityfr",
    component: () => import("@/views/CommunityFRView.vue"),
  },
  {
    path: "/edit-r-account",
    name: "EditR",
    component: () => import("@/views/EditRView.vue"),
  },
  {
    path: "/ncompetitionsr",
    name: "ncompetitionsr",
    component: () => import("@/views/NcompetitionsRView.vue"),
  },
  {
    path: "/resultsr",
    name: "resultsr",
    component: () => import("@/views/ResultsRView.vue"),
  },
  {
    path: "/results",
    name: "results",
    component: () => import("@/views/ResultsView.vue"),
  },
  {
    path: "/competition",
    name: "competition",
    component: () => import("@/views/CompetitionView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

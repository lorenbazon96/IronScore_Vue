import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/RegisterView.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/DashboardView.vue"),
  },
  {
    path: "/competitions",
    name: "competitions",
    component: () => import("../views/CompetitionsView.vue"),
  },
  {
    path: "/ncompetitions",
    name: "ncompetitions",
    component: () => import("../views/NcompetitionsView.vue"),
  },
  {
    path: "/goals",
    name: "goals",
    component: () => import("../views/GoalsView.vue"),
  },
  {
    path: "/weight",
    name: "weight",
    component: () => import("../views/WeightView.vue"),
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

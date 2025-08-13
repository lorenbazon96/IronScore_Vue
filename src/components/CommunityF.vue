<template>
  <div class="container-fluid">
    <div class="row min-vh-100">
      <aside class="col-12 col-md-3 sidebar bg-darka text-white p-3">
        <div class="logo mb-3">
          <img
            src="@/assets/logo-t.png"
            alt="IronScore Logo"
            class="img-fluid"
          />
        </div>
        <div class="user-info border-top pt-2 mb-3">
          <router-link to="/edit-account" class="edit d-block mb-2"
            >Edit Account</router-link
          >
          <p><strong>Name:</strong> {{ userStore.name }}</p>
          <p><strong>Surname:</strong> {{ userStore.surname }}</p>
          <p><strong>Email:</strong> {{ userStore.email }}</p>
          <p><strong>Age:</strong> {{ userStore.age }}</p>
        </div>
        <nav class="menu d-flex flex-column gap-2">
          <router-link to="/dashboard" class="menu-item">Dashboard</router-link>
          <router-link to="/competitions" class="menu-item"
            >Competitions</router-link
          >
          <router-link to="/community" class="menu-item active-item"
            >Community</router-link
          >
          <router-link to="/timer" class="menu-item">Timer</router-link>
          <router-link to="/trainings" class="menu-item">Trainings</router-link>
        </nav>
      </aside>

      <main
        class="col-12 col-md-9 community-new-content p-4 bg-black text-white"
      >
        <header
          class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4"
        >
          <h2 class="title text-warning fw-bold text-uppercase mb-2 mb-md-0">
            COMMUNITY
          </h2>
          <router-link
            to="/"
            class="btn btn-link text-warning fw-bold p-0 logout-link"
            >Log Out</router-link
          >
        </header>

        <section class="post-list">
          <router-link
            v-for="(post, index) in posts"
            :key="index"
            :to="`/communityp?id=${index}`"
            class="single-post text-decoration-none text-white"
          >
            <div class="post-author">{{ post.author }}</div>
            <div class="post-content">"{{ post.content }}"</div>
            <div class="post-date">{{ post.timestamp }}</div>
          </router-link>
        </section>

        <div>
          <input
            type="text"
            placeholder="Insert new post"
            class="new-post mt-5"
          />
        </div>
        <div class="add-post-button-wrapper">
          <button class="btn btn-warning fw-bold w-100">Add new post</button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user";
export default {
  name: "CommunityF",
  data() {
    return {
      posts: [
        {
          author: "Daniel Carter",
          content:
            "What’s Your Biggest Gym Achievement This Month? – Share your progress, whether it’s lifting heavier, improving form, or hitting a personal record!",
          timestamp: "March 5, 2022, at 3:45 PM",
        },
        {
          author: "Emily Dawson",
          content:
            "Pre-Workout Rituals: What Gets You in the Zone? – Share your go-to warm-ups, favorite playlists, or supplements that boost your performance.",
          timestamp: "July 18, 2019, at 10:30 AM",
        },
        {
          author: "Michael Novak",
          content:
            "Struggles & Comebacks: How Did You Overcome a Training Plateau? – Inspire others by sharing how you pushed through stagnation and kept making gains!",
          timestamp: "November 2, 2023, at 8:15 PM",
        },
        {
          author: "Tina Šarić",
          content:
            "Which gym app do you use to track your progress? Looking for good suggestions that are beginner-friendly!",
          timestamp: "February 12, 2024, at 5:45 PM",
        },
        {
          author: "Ivan Petrov",
          content:
            "How do you manage recovery? I started foam rolling and it’s made a huge difference after leg day!",
          timestamp: "May 3, 2023, at 9:12 AM",
        },
        {
          author: "Sandra Vuković",
          content:
            "Nutrition tips for building lean muscle? I’m trying to get stronger without bulking up too much.",
          timestamp: "August 9, 2023, at 1:30 PM",
        },
      ],
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
  },
};
</script>

<style scoped>
.logo img {
  width: 100%;
}

.user-info {
  border-top: 1px solid #333;
  padding-top: 10px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  color: #ffffff;
  font-weight: bold;
  text-decoration: none;
  font-size: 20px;
  text-transform: uppercase;
}

.active-item {
  color: #ffc107 !important;
}
.community-new-content {
  flex: 1;
  padding: 40px 30px;
  background: #000;
  color: #fff;
  overflow-y: auto;
}

.title {
  font-weight: bold;
}

.logout-link {
  color: #ffc107 !important;
  font-size: 14px;
  text-transform: uppercase;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 10px;
}

.single-post {
  background-color: #222;
  padding: 20px;
  border-radius: 5px;
}

.post-author {
  font-weight: bold;
  margin-bottom: 10px;
}

.post-content {
  font-size: 16px;
  margin-bottom: 10px;
}

.post-date {
  font-size: 13px;
  color: #aaa;
}

.add-post-button-wrapper {
  margin-top: 40px;
}

.new-post {
  background: rgb(30, 30, 30);
  width: 100%;
  min-height: 60px !important;
  margin-top: 60px;
  padding: 10px 10px;
  color: #ffff;
  font-size: 15px;
  border: 50px;
}

.edit {
  color: #ffc107;
}

.bg-darka {
  background-color: #000 !important;
}
</style>

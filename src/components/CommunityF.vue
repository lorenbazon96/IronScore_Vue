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
        <div class="user-info mb-3 border-top pt-2">
          <div
            class="user-info-inner d-flex justify-content-between align-items-center mt-2"
          >
            <div class="d-flex align-items-center">
              <img src="@/assets/user.png" alt="User" class="user-icon me-2" />
              <span class="fw-bold user-name">
                {{ userStore.name }} {{ userStore.surname }}
              </span>
            </div>

            <router-link
              to="/edit-account"
              class="settings-link d-flex align-items-center"
            >
              <img
                src="@/assets/setting1.png"
                alt="Settings"
                class="settings-icon"
              />
            </router-link>
          </div>
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
            class="btn btn-link text-warning fw-bold p-0 logout-link d-flex align-items-center"
          >
            <img
              src="@/assets/logout.png"
              alt="Logout"
              class="logout-icon me-2"
            />
            Log Out
          </router-link>
        </header>

        <section class="post-list">
          <router-link
            v-for="post in posts"
            :key="post.id"
            :to="`/communityp?id=${post.id}`"
            class="post-card router-post-link"
          >
            <div class="post-header d-flex align-items-center">
              <img src="@/assets/user.png" class="post-avatar" />
              <div class="ms-2">
                <div class="post-author">{{ post.author }}</div>
                <div class="post-date">{{ post.timestamp }}</div>
              </div>
            </div>

            <div class="post-content">“{{ post.content }}”</div>
          </router-link>
        </section>

        <div class="new-post-wrapper">
          <input
            type="text"
            placeholder="Share something with the community..."
            class="new-post-input"
            v-model="newPostContent"
          />

          <button class="btn btn-warning fw-bold new-post-btn" @click="addPost">
            <img src="@/assets/send.png" class="send-icon" />
            Post
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { useRoute } from "vue-router";

export default {
  name: "CommunityF",
  data() {
    return {
      posts: [],
      newPostContent: "",
      comments: [],
      newComment: "",
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
  },
  async mounted() {
    await this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      this.posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toLocaleString() || "",
      }));
    },
    async addPost() {
      if (!this.newPostContent.trim()) return;

      await addDoc(collection(db, "posts"), {
        author: `${this.userStore.name} ${this.userStore.surname}`,
        content: this.newPostContent,
        timestamp: serverTimestamp(),
      });

      this.newPostContent = "";
      await this.fetchPosts();
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
  height: 100vh;
  flex: 1;
  padding: 20px 30px;
  background: #000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 8px;
  padding-bottom: 10px;
}

.single-post {
  background-color: #222;
  padding: 20px;
  border-radius: 5px;
}

.post-author {
  font-weight: bold;
  margin-bottom: 10px;
  text-align: left;
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
  background-color: black !important;
}

.user-info {
  border-top: 1px solid #333;
  padding: 10px 15px 0 15px;
}

.user-icon {
  width: 28px;
  height: 28px;
}

.settings-icon {
  width: 22px;
  height: 22px;
}

.settings-link {
  color: #ffc107;
  text-decoration: none;
}

.settings-link:hover .settings-icon {
  transform: scale(1.05);
}

.user-name {
  font-size: 16px;
}

.user-info-inner {
  max-width: 260px;
  margin: 0 auto;
}

.logout-icon {
  width: 20px;
  height: 20px;
}

.new-post-wrapper {
  position: sticky;
  bottom: 0;
  background: #000;
  padding: 8px 0 4px;
  z-index: 10;
}

.post-card {
  background: #151515;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #222;
  transition: transform 0.15s ease, background 0.15s ease;
}

.post-card:hover {
  background: #1c1c1c;
  transform: translateY(-2px);
}

.post-header {
  margin-bottom: 12px;
}

.post-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  opacity: 0.85;
}

.post-author {
  font-weight: 700;
  font-size: 15px;
}

.post-date {
  font-size: 12px;
  color: #888;
}

.post-content {
  font-size: 17px;
  line-height: 1.4;
  color: #ddd;
  font-style: italic;
  border-left: 3px solid #ffc107;
  padding-left: 10px;
}

.new-post-input {
  width: 100%;
  background: #202020;
  border: 1px solid #333;
  padding: 10px 14px;
  color: #fff;
  font-size: 14px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.new-post-input::placeholder {
  color: #777;
}

.new-post-btn {
  width: 100%;
  padding: 10px;
  font-size: 15px;
  letter-spacing: 0.5px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.send-icon {
  width: 20px;
  margin-right: 8px;
}

.router-post-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
.router-post-link:hover {
  text-decoration: none;
}
</style>

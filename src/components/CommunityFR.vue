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
          <router-link to="/edit-r-account" class="edit d-block mb-2"
            >Edit Account</router-link
          >
          <p><strong>Name:</strong> {{ userStore.name }}</p>
          <p><strong>Surname:</strong> {{ userStore.surname }}</p>

        </div>
        <nav class="menu">
          <router-link to="/competitionsr" class="menu-item"
            >competitions</router-link
          >
          <router-link to="/communityfr" class="menu-item active-item"
            >Community</router-link
          >
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
            v-for="post in posts"
            :key="post.id"
            :to="`/communitypr?id=${post.id}`"
            class="single-post"
          >
            <div class="post-author">{{ post.author }}</div>
            <div class="post-content">"{{ post.content }}"</div>
            <div class="post-date">{{ post.timestamp }}</div>
          </router-link>
        </section>

        <input
          type="text"
          placeholder="Insert new post"
          class="new-post mt-5"
          v-model="newPostContent"
        />
        <div class="add-post-button-wrapper">
          <button class="btn btn-warning fw-bold w-100" @click="addPost">
            Add new post
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
  name: "CommunityFR",
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
</style>

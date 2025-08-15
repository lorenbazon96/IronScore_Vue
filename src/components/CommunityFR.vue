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
            >competitions</router-link
          >
          <router-link to="/community" class="menu-item active-item"
            >Community</router-link
          >
          <router-link to="/timer" class="menu-item">Timer</router-link>
          <router-link to="/trainings" class="menu-item">Trainings</router-link>
        </nav>
      </aside>

      <main class="col-12 col-md-9 community-content">
        <header class="community-header">
          <h2 class="title text-warning fw-bold text-uppercase mb-2 mb-md-0">
            Community
          </h2>
          <router-link
            to="/"
            class="btn btn-link text-warning fw-bold p-0 logout-link"
            >Log Out</router-link
          >
        </header>

        <div v-if="loading" class="text-white">Loading…</div>
        <div v-else-if="notFound" class="text-white">Post not found.</div>

        <div v-else-if="post" class="text-white bg-black p-0">
          <div class="bg-dark p-3 rounded mb-4">
            <strong>{{ post.author }}</strong>
            <p class="mb-1">{{ post.content }}</p>
            <small>{{ post.timestamp }}</small>
            <div class="mt-2 d-flex align-items-center gap-3">
              <button @click="likePost" class="btn btn-link text-warning p-0">
                {{ hasLikedPost() ? "Unlike 👎" : "Like 👍" }}
              </button>
              <span>{{ postLikesCount() }} 👍</span>
            </div>
          </div>

          <div
            v-for="(comment, cIndex) in post.comments"
            :key="cIndex"
            class="bg-secondary p-3 rounded mb-2"
          >
            <strong>{{ comment.author }}</strong>
            <p class="mb-1">{{ comment.text }}</p>
            <small>{{ comment.timestamp }}</small>
            <div class="mt-2 d-flex align-items-center gap-3">
              <button
                @click="likeComment(cIndex)"
                class="btn btn-link text-warning p-0"
              >
                {{ hasLikedComment(cIndex) ? "Unlike 👎" : "Like 👍" }}
              </button>
              <span>{{ commentLikesCount(cIndex) }} 👍</span>
            </div>
          </div>

          <div class="mt-4">
            <input
              v-model="newComment"
              type="text"
              class="form-control mb-2"
              placeholder="Type your comment..."
              @keyup.enter="submitComment"
            />
            <button
              @click="submitComment"
              class="btn btn-warning fw-bold w-100"
            >
              Add new comment
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/user";
import { db } from "@/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useRoute } from "vue-router";

export default {
  name: "CommunityR",
  data() {
    return {
      post: null,
      newComment: "",
      loading: true,
      notFound: false,
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    userKey() {
      return this.userStore?.uid || this.userStore?.email || "anonymous";
    },
  },
  async mounted() {
    const route = useRoute();
    const postId = route.query.id;
    if (!postId) {
      this.loading = false;
      this.notFound = true;
      return;
    }

    try {
      const ref = doc(db, "posts", postId);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        this.notFound = true;
      } else {
        const data = snap.data();
        this.post = {
          id: snap.id,
          author: data.author || "",
          content: data.content || "",

          likesBy: Array.isArray(data.likesBy)
            ? data.likesBy
            : data.likes
            ? Array(data.likes).fill("legacy")
            : [],
          comments: Array.isArray(data.comments)
            ? data.comments.map((c) => ({
                author: c.author || "",
                text: c.text || "",
                timestamp: c.timestamp || "",
                likesBy: Array.isArray(c.likesBy)
                  ? c.likesBy
                  : typeof c.likes === "number"
                  ? Array(c.likes).fill("legacy")
                  : [],
              }))
            : [],
          timestamp: data.timestamp
            ? data.timestamp.toDate().toLocaleString()
            : "",
        };
      }
    } catch (e) {
      console.error(e);
      this.notFound = true;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    postLikesCount() {
      return this.post?.likesBy?.length || 0;
    },
    commentLikesCount(cIndex) {
      return this.post?.comments?.[cIndex]?.likesBy?.length || 0;
    },
    hasLikedPost() {
      return this.post?.likesBy?.includes(this.userKey);
    },
    hasLikedComment(cIndex) {
      const c = this.post?.comments?.[cIndex];
      return c?.likesBy?.includes(this.userKey);
    },

    async likePost() {
      if (!this.post) return;
      const ref = doc(db, "posts", this.post.id);
      const already = this.hasLikedPost();

      if (already) {
        await updateDoc(ref, { likesBy: arrayRemove(this.userKey) });
        this.post.likesBy = this.post.likesBy.filter((u) => u !== this.userKey);
      } else {
        await updateDoc(ref, { likesBy: arrayUnion(this.userKey) });
        this.post.likesBy = [...this.post.likesBy, this.userKey];
      }
    },

    async likeComment(cIndex) {
      if (!this.post) return;
      const ref = doc(db, "posts", this.post.id);

      const updated = this.post.comments.map((c, i) => {
        if (i !== cIndex) return c;
        const liked = c.likesBy?.includes(this.userKey);
        const likesBy = liked
          ? c.likesBy.filter((u) => u !== this.userKey)
          : [...(c.likesBy || []), this.userKey];
        return { ...c, likesBy };
      });

      await updateDoc(ref, { comments: updated });
      this.post.comments = updated;
    },

    async submitComment() {
      const text = this.newComment.trim();
      if (!text || !this.post) return;

      const newC = {
        author:
          `${this.userStore.name} ${this.userStore.surname}`.trim() ||
          "Anonymous",
        text,
        timestamp: new Date().toLocaleString(),
        likesBy: [],
      };

      const ref = doc(db, "posts", this.post.id);

      const updated = [...this.post.comments, newC];
      await updateDoc(ref, { comments: updated });

      this.post.comments = updated;
      this.newComment = "";
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

.community-content {
  flex: 1;
  padding: 30px;
  background: #000;
  overflow-y: auto;
}

.community-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: #ffc107;
  text-transform: uppercase;
  font-weight: 900;
}

.title {
  font-weight: bold;
  color: #ffc107;
}

.post {
  background-color: #222;
  border-radius: 5px;
}
.logout-link {
  color: #ffc107 !important;
  font-size: 14px;
  text-transform: uppercase;
}
.post input[type="text"] {
  background: #111;
  color: #fff;
  border: 1px solid #555;
}

.post small {
  color: #aaa;
}

.post button {
  font-size: 0.9rem;
}
.comment-box {
  background-color: #111;
  border: 1px solid #333;
  border-radius: 5px;
  color: #fff;
  text-align: left;
}
.comment-box small {
  color: #aaa;
}

.edit {
  color: #ffc107;
}

.bg-darka {
  background-color: #000 !important;
}
</style>

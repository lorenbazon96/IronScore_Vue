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
              to="/edit-r-account"
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
          <router-link to="/competitionsr" class="menu-item"
            >competitions</router-link
          >
          <router-link to="/communityfr" class="menu-item active-item"
            >Community</router-link
          >
        </nav>
      </aside>

      <main class="col-12 col-md-9 community-single-content">
        <header class="community-header">
          <h2 class="title text-warning fw-bold text-uppercase mb-2 mb-md-0">
            Community
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

        <div class="post-scroll-area">
          <div v-if="loading" class="text-white text-center mt-5">Loading…</div>
          <div v-else-if="notFound" class="text-white text-center mt-5">
            Post not found.
          </div>

          <div v-else-if="post">
            <div class="post-card">
              <div class="post-header d-flex align-items-center">
                <img src="@/assets/user.png" class="post-avatar" />
                <div class="ms-2">
                  <div class="post-author">{{ post.author }}</div>
                  <div class="post-date">{{ post.timestamp }}</div>
                </div>
              </div>

              <div class="post-content">“{{ post.content }}”</div>

              <div class="post-actions d-flex align-items-center mt-3 gap-3">
                <button @click="likePost" class="post-like-btn">
                  <span v-if="hasLikedPost()">👍 Unlike</span>
                  <span v-else>👍 Like</span>
                </button>
                <span class="text-white-50">{{ postLikesCount() }} likes</span>
              </div>
            </div>

            <div
              v-for="(comment, cIndex) in post.comments"
              :key="cIndex"
              class="comment-card"
            >
              <div class="comment-header d-flex align-items-center">
                <img src="@/assets/user.png" class="comment-avatar" />
                <div class="ms-2">
                  <div class="comment-author">{{ comment.author }}</div>
                  <div class="comment-date">{{ comment.timestamp }}</div>
                </div>
              </div>

              <div class="comment-text">
                {{ comment.text }}
              </div>

              <div class="comment-actions d-flex align-items-center mt-2 gap-3">
                <button @click="likeComment(cIndex)" class="comment-like-btn">
                  <span v-if="hasLikedComment(cIndex)">👍 Unlike</span>
                  <span v-else>👍 Like</span>
                </button>
                <span class="text-white-50">
                  {{ commentLikesCount(cIndex) }} likes
                </span>
              </div>
            </div>

            <div class="new-comment-wrapper">
              <input
                v-model="newComment"
                type="text"
                class="new-comment-input"
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

.bg-darka {
  background-color: #000 !important;
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

.logout-link {
  color: #ffc107 !important;
  font-size: 14px;
  text-transform: uppercase;
}

.community-single-content {
  flex: 1;
  background: #000;
  padding: 30px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.community-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-weight: bold;
  color: #ffc107;
}

.post-scroll-area {
  flex: 1;
  overflow-y: auto;
  padding-right: 6px;
}

.post-card {
  background: #151515;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #222;
  margin-bottom: 25px;
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
  margin-top: 10px;
}

.post-like-btn {
  border: none;
  background: none;
  color: #ffc107;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
}

.comment-card {
  background: #111;
  padding: 18px;
  border-radius: 10px;
  border: 1px solid #222;
  margin-bottom: 15px;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  opacity: 0.85;
}

.comment-author {
  font-weight: 700;
  font-size: 14px;
}

.comment-date {
  font-size: 11px;
  color: #777;
}

.comment-text {
  color: #ddd;
  font-size: 15px;
  margin-top: 8px;
  border-left: 3px solid #ffc107;
  padding-left: 10px;
}

.comment-like-btn {
  border: none;
  background: none;
  color: #ffc107;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
}

.new-comment-wrapper {
  position: sticky;
  bottom: 0;
  background: #000;
  padding-top: 10px;
}

.new-comment-input {
  width: 100%;
  background: #202020;
  border: 1px solid #333;
  padding: 12px;
  color: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
}

.new-comment-input::placeholder {
  color: #777;
}
</style>

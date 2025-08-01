<template>
  <div class="community-container">
    <aside class="sidebar">
      <div class="logo">
        <img src="@/assets/logo-t.png" alt="IronScore Logo" />
      </div>
      <div class="user-info">
        <router-link to="/edit-r-account" class="edit"
          >Edit Account</router-link
        >
        <p><strong>Name:</strong> Example</p>
        <p><strong>Surname:</strong> Example</p>
        <p><strong>Email:</strong> example@gmail.com</p>
        <p><strong>Age:</strong> 25</p>
        <p><strong>Account type:</strong> Referee</p>
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

    <main class="community-content">
      <header class="community-header">
        <h2 class="title">Community</h2>
        <router-link
          to="/"
          class="btn btn-link text-warning fw-bold p-0 logout-link"
        >
          Log Out
        </router-link>
      </header>

      <section class="container-fluid px-0">
        <div
          v-for="(post, index) in posts"
          :key="index"
          class="post bg-dark text-white mb-3 p-3 rounded"
        >
          <strong>{{ post.author }}</strong>
          <p class="mb-1">{{ post.content }}</p>
          <small>{{ post.timestamp }}</small>

          <div
            v-for="(comment, cIndex) in post.comments"
            :key="cIndex"
            class="comment-box mt-3 p-3"
          >
            <strong>{{ comment.author }}</strong>
            <p class="mb-1">{{ comment.text }}</p>
            <small>{{ comment.timestamp }}</small>

            <div class="d-flex align-items-center mt-2 gap-3">
              <button
                class="btn btn-link text-white p-0"
                @click="likeComment(index, cIndex)"
              >
                Like 👍
              </button>
              <span class="ms-auto">{{ comment.likes }} 👍</span>
            </div>
          </div>

          <div class="d-flex align-items-center mt-2 gap-3">
            <button
              class="btn btn-link text-white p-0"
              @click="likePost(index)"
            >
              Like 👍
            </button>
            <span class="ms-auto">{{ post.likes }} 👍</span>
          </div>

          <input
            v-model="newComments[index]"
            type="text"
            class="form-control form-control-sm mt-2"
            placeholder="Type your comment..."
            @keyup.enter="submitComment(index)"
          />
        </div>

        <div class="text-center mt-4">
          <button class="btn btn-warning fw-bold">Add new comment</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: "CommunityRView",
  data() {
    return {
      posts: [
        {
          author: "Daniel Carter",
          content:
            "“What’s Your Biggest Gym Achievement This Month?” – Share your progress, whether it’s lifting heavier, improving form, or hitting a personal record!",
          timestamp: "March 5, 2022, at 3:45 PM",
          likes: 22,
          comments: [
            {
              author: "Petra Horvat",
              text: "I finally managed to do 5 proper pull-ups without assistance! 💪 A month ago, I could barely do one.",
              timestamp: "March 6, 2022, at 9:12 AM",
              likes: 0,
            },
            {
              author: "Marko Perić",
              text: "For the first time ever, I completed an entire HIIT session without a break! My cardio is way better than last month.",
              timestamp: "March 8, 2022, at 6:30 PM",
              likes: 0,
            },
            {
              author: "Lucija Novak",
              text: "Held a plank for 3 minutes and 15 seconds! A month ago, I could barely last one. Super proud of the progress 💥",
              timestamp: "March 15, 2022, at 8:47 PM",
              likes: 0,
            },
          ],
        },
      ],
      newComments: [""], // one per post
    };
  },
  methods: {
    likePost(index) {
      this.posts[index].likes++;
    },
    likeComment(postIndex, commentIndex) {
      this.posts[postIndex].comments[commentIndex].likes++;
    },
    submitComment(index) {
      const commentText = this.newComments[index].trim();
      if (commentText) {
        this.posts[index].comments.push({
          author: "You",
          text: commentText,
          timestamp: new Date().toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
          likes: 0, // 🆕 moraš dodati likes i za novi komentar
        });
        this.newComments[index] = "";
      }
    },
  },
};
</script>

<style scoped>
.community-container {
  display: flex;
  height: 100vh;
  font-family: "Roboto", sans-serif;
  color: #fff;
  background: #000;
}

@media (min-width: 992px) {
  .community-container {
    flex-direction: row;
  }
}

.sidebar {
  width: 250px;
  background: #111;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}

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
</style>

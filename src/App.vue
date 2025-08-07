<template>
  <router-view />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  height: auto;
  background-color: black;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<script>
import { useUserStore } from "@/stores/user";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

export default {
  name: "App",

  mounted() {
    const userStore = useUserStore();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await userStore.fetchUser();
        console.log("Korisnik prijavljen:", user.email);
      } else {
        console.log("Nema prijavljenog korisnika");
      }
    });
  },
};
</script>

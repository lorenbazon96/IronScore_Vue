<template>
  <div class="home">
    <pocetna msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import pocetna from "@/components/pocetna.vue";

export default {
  name: "HomeView",
  components: {
    pocetna,
  },
};
</script>

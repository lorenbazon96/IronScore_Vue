<template>
  <div class="workouts-view">
    <Workouts />
  </div>
</template>

<script>
import Workouts from "@/components/Workouts.vue";

export default {
  name: "WorkoutsView",
  components: {
    Workouts,
  },
};
</script>

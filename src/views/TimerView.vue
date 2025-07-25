<template>
  <div class="timer-view">
    <Timer />
  </div>
</template>

<script>
import Timer from "@/components/Timer.vue";

export default {
  name: "TimerView",
  components: {
    Timer,
  },
};
</script>

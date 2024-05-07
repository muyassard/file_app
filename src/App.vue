<script setup lang="ts">
  import Multiple from "./components/Multiple.vue";
  import Single from "./components/Single.vue";

  const maxSize = 1024 * 1024 * 5;
  const limit = 3;
  const type = "jpeg";
</script>

<template>
  <div class="w-100%">
    <Single :type="type" :maxSize="maxSize" />
    <Multiple :limit="limit" :maxSize="maxSize" :type="type" />
  </div>
</template>

<style scoped></style>

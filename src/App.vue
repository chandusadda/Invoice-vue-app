<script setup lang="ts">
import { RouterView } from "vue-router";
import SideViewVue from "./views/SideView.vue";
</script>

<template>
<SideViewVue></SideViewVue>
  <div>
    <RouterView />
  </div>
</template>

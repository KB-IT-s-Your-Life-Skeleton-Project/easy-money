<script setup>
import Header from './components/Header.vue';
import TabBar from './components/TabBar.vue';
const isVisible = false;
</script>

<template>
  <Header v-if="isVisible" />
  <TabBar v-if="isVisible" />
  <router-view></router-view>
</template>

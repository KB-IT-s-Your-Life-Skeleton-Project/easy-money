<script setup>
import Header from './components/Header.vue';
import TabBar from './components/TabBar.vue';
import TransactionView from './views/TransactionView.vue';

const isVisible = false;
</script>

<template>
  <Header v-if="isVisible" />
  <TabBar v-if="isVisible" />
  <!-- <TransactionView /> -->
  <router-view></router-view>
</template>

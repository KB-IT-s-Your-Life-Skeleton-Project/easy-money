<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const currentTab = ref('calendar');

const tabs = [
  { key: 'calendar', path: '/calendar', label: '달력' },
  { key: 'history', path: '/transactions', label: '거래 내역' },
  { key: 'category', path: '/category', label: '통계' },
  { key: 'chart', path: '/chart', label: '차트' },
];

const handleClickTab = (tab) => {
  currentTab.value = tab.key;
  router.push(tab.path);
};

// 현재 URL 주소를 감지해서 currentTab을 자동으로 맞춰줍니다.
watch(
  () => route.path,
  (newPath) => {
    const activeTab = tabs.find((tab) => tab.path === newPath);
    if (activeTab) {
      currentTab.value = activeTab.key;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <button
      class="tab"
      v-for="tab in tabs"
      :key="tab.key"
      :class="{ activate: currentTab === tab.key }"
      @click="handleClickTab(tab)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped>
div {
  display: flex;
  margin-top: 10px;
}
.tab {
  border: none;
  border-bottom: 1px solid var(--color-gray);
  background: none;
  flex: 1;
  font-weight: 500;
  padding: 12px 0;
}
.tab.activate {
  color: var(--color-yellow-light);
  border-bottom: 1px solid var(--color-yellow-light);
}
.tab:hover {
  cursor: pointer;
}
</style>

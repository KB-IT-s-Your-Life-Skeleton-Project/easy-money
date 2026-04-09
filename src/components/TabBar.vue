<script setup>
import { ref } from "vue";
const currentTab = ref("calendar");
const tabs = [
  { key: "calendar", label: "달력" },
  { key: "history", label: "거래 내역" },
  { key: "category", label: "통계" },
  { key: "chart", label: "차트" },
];

const handleClickTab = (tab) => {
  currentTab.value = tab.key;
};
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
}
.tab.activate {
  color: var(--color-yellow-light);
  border-bottom: 1px solid var(--color-yellow-light);
}
.tab:hover {
  cursor: pointer;
}
</style>

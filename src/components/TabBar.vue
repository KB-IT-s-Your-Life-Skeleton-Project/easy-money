<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'; // 1. 라우터 가져오기

const router = useRouter(); // 2. 페이지 이동을 위한 객체
const route = useRoute(); // (선택) 현재 주소를 알기 위한 객체

const currentTab = ref('calendar');

// 3. 각 탭이 이동할 주소(path)를 추가해줍니다.
// (이전 대화의 라우터 설정에 맞춰 거래 내역은 /transactions로 설정했습니다. 필요에 따라 수정하세요!)
const tabs = [
  { key: 'calendar', path: '/calendar', label: '달력' },
  { key: 'history', path: '/transactions', label: '거래 내역' },
  { key: 'category', path: '/category', label: '통계' },
  { key: 'chart', path: '/chart', label: '차트' },
];

const handleClickTab = (tab) => {
  currentTab.value = tab.key;
  // 4. 클릭 시 해당 주소로 이동!
  router.push(tab.path);
};

// 💡 꿀팁: 새로고침하거나 뒤로가기 했을 때도 탭 활성화 상태를 유지하려면?
// 현재 URL 주소를 감지해서 currentTab을 자동으로 맞춰줍니다.
watch(
  () => route.path,
  (newPath) => {
    const activeTab = tabs.find((tab) => tab.path === newPath);
    if (activeTab) {
      currentTab.value = activeTab.key;
    }
  },
  { immediate: true } // 컴포넌트가 처음 렌더링될 때도 즉시 실행
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
}
.tab.activate {
  color: var(--color-yellow-light);
  border-bottom: 1px solid var(--color-yellow-light);
}
.tab:hover {
  cursor: pointer;
}
</style>

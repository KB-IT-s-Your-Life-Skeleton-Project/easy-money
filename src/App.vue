<script setup>
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore.js';
import Header from './components/common/Header.vue';
import TabBar from './components/common/TabBar.vue';
import SummaryCard from './components/transaction/SummaryCard.vue';
import CommonButton from './components/common/CommonButton.vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const { isLogin } = storeToRefs(userStore);

const hideNavPaths = [
  '/transaction/create',
  '/profile-edit',
  '/transaction/detail',
];

const showNavigation = computed(() => {
  return (
    isLogin.value && !hideNavPaths.some((path) => route.path.startsWith(path))
  );
});

const goTransactionCreate = () => {
  router.push('/transaction/create');
};
</script>

<template>
  <div class="app-container">
    <div v-if="showNavigation" class="top-navigation">
      <Header />
      <TabBar />
    </div>

    <main :class="{ 'content-area': showNavigation }">
      <SummaryCard v-if="showNavigation" />
      <router-view></router-view>
    </main>

    <div v-if="showNavigation" class="bottom-navigation">
      <div class="add-button-wrapper">
        <CommonButton
          text="거래 내역 추가"
          @click="goTransactionCreate"
          class="btn-add-transaction"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f6f8; /* 사진처럼 카드가 돋보이도록 뒷배경 약간 회색으로 처리 */
}

.top-navigation {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 100;
  /* 탭바 하단에만 아주 옅은 선을 그어 구분감 부여 */
  border-bottom: 1px solid #eee;
}

.content-area {
  flex: 1;
  padding-bottom: 80px;
}

.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: transparent; /* 버튼 배경은 하얀색으로 통일 */
  z-index: 100;
}

.add-button-wrapper {
  padding: 10px 20px;
}

.btn-add-transaction {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: var(--color-yellow-light, #f1c40f); /* 노란색 톤 유지 */
  color: white;
  text-align: center;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  border: none;
  cursor: pointer;
}
</style>

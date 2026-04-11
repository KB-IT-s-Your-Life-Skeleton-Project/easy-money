<script setup>
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore.js';
import Header from './components/Header.vue';
import TabBar from './components/TabBar.vue';
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
    isLogin.value &&
    !hideNavPaths.some((path) => route.path.startsWith(path))
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
/* 전체 화면 틀 */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ★ 상단 영역 고정 (스크롤해도 위에 붙어있게 하려면) */
.top-navigation {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 100;
  /* 필요하다면 여기에 그림자를 넣어 구분감을 줄 수 있습니다 */
  /* box-shadow: 0 2px 5px rgba(0,0,0,0.05); */
}

/* 내용물 여백 설정 */
.content-area {
  flex: 1;
  /* 하단에 버튼이 있으니 버튼이 가리지 않게 여백을 줍니다 */
  padding-bottom: 80px;
}

/* 하단 버튼 영역 고정 */
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: white;
  z-index: 100;
}

.add-button-wrapper {
  padding: 10px 20px;
}

.btn-add-transaction {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #42b983;
  color: white;
  text-align: center;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  border: none;
  cursor: pointer;
}
</style>

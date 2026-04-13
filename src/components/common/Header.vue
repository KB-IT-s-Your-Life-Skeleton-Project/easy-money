<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useMonthlyTransactionStore } from '@/stores/monthlyTranscationStore';

const router = useRouter();
const monthlyTransactionStore = useMonthlyTransactionStore();
const { currentMonth } = storeToRefs(monthlyTransactionStore);

const currentMonthNumber = computed(() =>
  Number(currentMonth.value.split('-')[1])
);

const goProfileEdit = () => {
  router.push('/profile-edit');
};

const prevMonth = () => {
  monthlyTransactionStore.shiftCurrentMonth(-1);
};

const nextMonth = () => {
  monthlyTransactionStore.shiftCurrentMonth(1);
};
</script>

<template>
  <header class="header-container">
    <div class="month-nav">
      <button class="arrow-btn" @click="prevMonth">&lt;</button>
      <span class="month-text">{{ currentMonthNumber }}월</span>
      <button class="arrow-btn" @click="nextMonth">&gt;</button>
    </div>
    <img
      src="/defaultProfileImage.svg"
      alt="프로필 이미지"
      @click="goProfileEdit"
      class="profile-img"
    />
  </header>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px 0px; /* 탭바와 자연스럽게 이어지도록 하단 여백 제거 */
  background-color: white;
}
.month-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}
.month-text {
  font-size: 20px;
  font-weight: 700;
}
.arrow-btn {
  background: none;
  border: none;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  color: #333;
}
.profile-img {
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
}
</style>

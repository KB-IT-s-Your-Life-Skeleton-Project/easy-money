<script setup>
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useMonthlyTransactionStore } from '@/stores/monthlyTranscationStore';

const router = useRouter();
const monthlyTransactionStore = useMonthlyTransactionStore();
const { currentMonth, monthlyIncome, monthlyExpense } =
  storeToRefs(monthlyTransactionStore);

onMounted(() => {
  monthlyTransactionStore.fetchMonthTransactions();
});

const monthLabel = computed(() => `${Number(currentMonth.value.split('-')[1])}월 내 소비`);
const balance = computed(() => monthlyIncome.value - monthlyExpense.value);
const isPlus = computed(() => balance.value > 0);
const currentYear = computed(() => Number(currentMonth.value.split('-')[0]));
const currentMonthNumber = computed(() =>
  Number(currentMonth.value.split('-')[1]),
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
  <div class="dashboard-container">
    <div class="header-row margin-top">
      <div class="header-text-group">
        <span class="bold">{{ monthLabel }}</span>
        <div class="month-nav">
          <button class="arrow-btn" @click="prevMonth">&lt;</button>
          <span class="month-text">{{ currentYear }}년 {{ currentMonthNumber }}월</span>
          <button class="arrow-btn" @click="nextMonth">&gt;</button>
        </div>
      </div>
      <span>
        <img
          src="/defaultProfileImage.svg"
          alt="기본이미지"
          @click="goProfileEdit"
          class="profile-img"
        />
      </span>
    </div>

    <div class="summary-row">
      <div class="total">
        <span> {{ isPlus ? '+' : '' }}{{ balance.toLocaleString() }}원 </span>
      </div>
      <div>
        <div class="space-between">
          <span>수입: </span>
          <span class="income">+{{ monthlyIncome.toLocaleString() }}원</span>
        </div>
        <div class="space-between">
          <span>지출: </span>
          <span class="expense">-{{ monthlyExpense.toLocaleString() }}원</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 8px 12px 12px;
}
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
}
.header-text-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.month-nav {
  display: flex;
  align-items: center;
  gap: 10px;
}
.month-text {
  min-width: 120px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
}
.arrow-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}
.space-between {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
}
.bold {
  font-weight: bold;
}
.total {
  font-size: 1.5em;
  color: var(--color-yellow-light);
  display: flex;
  align-items: center;
}
.income {
  color: var(--color-income);
}
.expense {
  color: var(--color-expense);
}
.margin-top {
  margin-top: 30px;
}
/* 아까 추가하기로 했던 손가락 모양 커서도 클래스로 깔끔하게 분리! */
.profile-img {
  cursor: pointer;
  width: 36px;
  height: 36px;
}
</style>

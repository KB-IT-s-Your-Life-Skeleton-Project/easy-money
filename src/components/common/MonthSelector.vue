<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMonthlyTransactionStore } from '@/stores/monthlyTranscationStore';

const monthlyTransactionStore = useMonthlyTransactionStore();
const { currentMonth } = storeToRefs(monthlyTransactionStore);

const currentYear = computed(() => Number(currentMonth.value.split('-')[0]));
const currentMonthNumber = computed(() =>
  Number(currentMonth.value.split('-')[1]),
);

const prevMonth = () => {
  monthlyTransactionStore.shiftCurrentMonth(-1);
};

const nextMonth = () => {
  monthlyTransactionStore.shiftCurrentMonth(1);
};
</script>

<template>
  <div class="month-selector">
    <button class="arrow-btn" @click="prevMonth">&lt;</button>
    <span class="month-text">{{ currentYear }}년 {{ currentMonthNumber }}월</span>
    <button class="arrow-btn" @click="nextMonth">&gt;</button>
  </div>
</template>

<style scoped>
.month-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.month-text {
  min-width: 120px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
}

.arrow-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}
</style>

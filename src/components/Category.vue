<template>
  <div class="category-view">
    <div class="controls">
      <div class="month-selector">
        <button class="arrow-btn" @click="prevMonth">&lt;</button>
        <span class="month-text">{{ currentYear }}년 {{ currentMonth }}월</span>
        <button class="arrow-btn" @click="nextMonth">&gt;</button>
      </div>

      <div class="type-toggle">
        <button
          :class="{ active: currentType === 'income' }"
          @click="currentType = 'income'"
        >
          수입
        </button>
        <button
          :class="{ active: currentType === 'expense' }"
          @click="currentType = 'expense'"
        >
          지출
        </button>
      </div>
    </div>

    <div class="chart-wrapper">
      <Bar :data="chartData" :options="chartOptions" />
    </div>

    <div class="category-list">
      <div class="list-item" v-for="(item, index) in categoryData" :key="index">
        <div class="item-left">
          <div class="icon">
            <img
              :src="categoryIcons[item.iconKey]"
              :alt="item.name"
              class="icon-image"
            />
          </div>

          <div class="item-info">
            <span class="name">{{ item.name }}</span>
            <span class="percent">{{ item.percent }}%</span>
          </div>
        </div>

        <div class="item-right">
          <span class="amount">{{ item.amount.toLocaleString() }}원</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

import { categoryIcons } from '@/constants/categoryIcons';
import { categoryColors } from '@/constants/categoryColors';

ChartJS.register(Tooltip, BarElement, CategoryScale, LinearScale);

// --- 상태 관리 ---
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);
const currentType = ref('income');

// 테스트용 임시 데이터
const incomeData = ref([
  {
    name: '용돈',
    percent: 50,
    amount: 500000,
    chartColor: categoryColors.income.allowance,
    iconKey: 'allowance',
  },
  {
    name: '급여',
    percent: 30,
    amount: 300000,
    chartColor: categoryColors.income.salary,
    iconKey: 'salary',
  },
  {
    name: '부가 수입',
    percent: 20,
    amount: 200000,
    chartColor: categoryColors.income.extra,
    iconKey: 'extra',
  },
]);

const expenseData = ref([
  {
    name: '식비',
    percent: 40,
    amount: 400000,
    chartColor: categoryColors.expense.food,
    iconKey: 'food',
  },
  {
    name: '고정지출',
    percent: 30,
    amount: 300000,
    chartColor: categoryColors.expense.fixed,
    iconKey: 'fixed',
  },
  {
    name: '쇼핑',
    percent: 20,
    amount: 200000,
    chartColor: categoryColors.expense.shopping,
    iconKey: 'shopping',
  },
  {
    name: '교통',
    percent: 10,
    amount: 100000,
    chartColor: categoryColors.expense.transportation,
    iconKey: 'transportation',
  },
]);

const categoryData = computed(() => {
  return currentType.value === 'income' ? incomeData.value : expenseData.value;
});

// --- 기능 ---
const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

// --- 차트 설정 ---
const chartData = computed(() => {
  return {
    labels: ['Progress'],
    datasets: categoryData.value.map((item, index) => {
      const isFirst = index === 0;
      const isLast = index === categoryData.value.length - 1;

      let borderRadius = 0;
      if (isFirst) borderRadius = { topLeft: 20, bottomLeft: 20 };
      if (isLast) borderRadius = { topRight: 20, bottomRight: 20 };

      return {
        label: item.name,
        data: [item.percent],
        backgroundColor: item.chartColor,
        borderWidth: 2,
        borderColor: '#ffffff',
        borderSkipped: false,
        borderRadius,
      };
    }),
  };
});

const chartOptions = ref({
  animation: false,
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: { enabled: false },
  },
  scales: {
    x: { stacked: true, display: false },
    y: { stacked: true, display: false },
  },
});
</script>

<style scoped>
.category-view {
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.month-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
}

.month-text {
  min-width: 90px;
  text-align: center;
}

.arrow-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.type-toggle {
  display: flex;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.type-toggle button {
  border: none;
  background: none;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  color: #888;
}

.type-toggle button.active {
  background-color: var(--color-white);
  color: #333;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.chart-wrapper {
  width: 100%;
  height: 25px;
  margin-bottom: 40px;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.list-item {
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 20px;
  align-items: center;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-image {
  width: 40px;
  height: 40px;
  object-fit: contain;
  display: block;
}

.item-info {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.percent {
  margin-top: 6px;
  font-size: 12px;
  color: #666;
}

.item-right .amount {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
</style>

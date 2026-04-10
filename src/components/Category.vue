<template>
  <div class="category-view">
    <div class="controls">
      <div class="month-selector">
        <button class="arrow-btn" @click="prevMonth">&lt;</button>
        <span class="month-text">{{ currentMonth }}월</span>
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
          <div class="icon" :style="{ backgroundColor: item.color }">
            {{ item.icon }}
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

ChartJS.register(Tooltip, BarElement, CategoryScale, LinearScale);

// --- 상태 관리 (State) ---
const currentMonth = ref(4);
const currentType = ref('income'); // 'expense' 또는 'income'

// 테스트용 임시 데이터
const incomeData = ref([
  { name: '용돈', percent: 50, amount: 500000, color: '#f1c45f', icon: '💰' },
  { name: '급여', percent: 30, amount: 300000, color: '#d87070', icon: '🏧' },
  { name: '기타', percent: 20, amount: 200000, color: '#678dec', icon: '💵' },
]);

const expenseData = ref([
  { name: '식비', percent: 40, amount: 400000, color: '#f1c45f', icon: '🍽️' },
  { name: '월세', percent: 30, amount: 300000, color: '#d87070', icon: '🏠' },
  { name: '카페', percent: 20, amount: 200000, color: '#678dec', icon: '☕' },
  { name: '기타', percent: 10, amount: 100000, color: '#8bc48f', icon: '📁' },
]);

// 💡 수정된 부분: currentType에 따라 수입/지출 데이터를 동적으로 반환합니다.
const categoryData = computed(() => {
  return currentType.value === 'income' ? incomeData.value : expenseData.value;
});

// --- 기능 (Methods) ---
const prevMonth = () => {
  if (currentMonth.value > 1) currentMonth.value--;
};
const nextMonth = () => {
  if (currentMonth.value < 12) currentMonth.value++;
};

// --- 차트 설정 (Chart.js) ---
const chartData = computed(() => {
  return {
    labels: ['Progress'],
    datasets: categoryData.value.map((item, index) => {
      // 첫 번째와 마지막 데이터셋에만 테두리 둥글게 적용
      const isFirst = index === 0;
      const isLast = index === categoryData.value.length - 1;

      let borderRadius = 0;
      if (isFirst) borderRadius = { topLeft: 20, bottomLeft: 20 };
      if (isLast) borderRadius = { topRight: 20, bottomRight: 20 };

      return {
        label: item.name,
        data: [item.percent], // 퍼센트 값으로 차트 길이 결정
        backgroundColor: item.color,
        borderWidth: 2,
        borderColor: '#ffffff',
        borderSkipped: false,
        borderRadius: borderRadius,
      };
    }),
  };
});

const chartOptions = ref({
  animation: false,
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: { tooltip: { enabled: false } },
  scales: {
    x: { stacked: true, display: false },
    y: { stacked: true, display: false },
  },
});
</script>

<style scoped>
/* 전체 레이아웃 */
.category-view {
  padding: 20px;
  max-width: 400px; /* 모바일 사이즈 느낌을 위해 제한 (필요시 제거) */
  margin: 0 auto;
}

/* 컨트롤 영역 (월 선택, 수입/지출) */
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

/* 차트 영역 */
.chart-wrapper {
  width: 100%;
  height: 25px; /* 차트 두께 */
  margin-bottom: 40px;
}

/* 리스트 영역 */
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
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
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

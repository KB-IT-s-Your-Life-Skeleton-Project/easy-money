<script setup>
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { useMonthlyTransactionStore } from '@/stores/monthlyTranscationStore';
import MonthSelector from '@/components/common/MonthSelector.vue';
import { categoryIcons } from '@/constants/categoryIcons';
import {
  getCategoryColor,
  getCategoryLabel,
  normalizeCategoryKey,
} from '@/constants/categoryMeta';

ChartJS.register(Tooltip, BarElement, CategoryScale, LinearScale);

const monthlyTransactionStore = useMonthlyTransactionStore();
const { transactions } = storeToRefs(monthlyTransactionStore);

const currentType = ref('income');

onMounted(() => {
  monthlyTransactionStore.fetchMonthTransactions();
});

const categoryData = computed(() => {
  const filtered = transactions.value.filter(
    (item) => item.type === currentType.value && item.isIncluded !== false
  );

  const totalAmount = filtered.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );
  const grouped = filtered.reduce((acc, item) => {
    const key = normalizeCategoryKey(item.category);
    acc[key] = (acc[key] ?? 0) + Number(item.amount || 0);
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([key, amount]) => ({
      key,
      name: getCategoryLabel(key),
      amount,
      percent: totalAmount ? Math.round((amount / totalAmount) * 100) : 0,
      chartColor: getCategoryColor(currentType.value, key),
      iconKey: key,
    }))
    .sort((a, b) => b.amount - a.amount);
});

const chartData = computed(() => ({
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
}));

const chartOptions = {
  animation: false,
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: { enabled: false },
  },
  scales: {
    x: { stacked: true, display: false, max: 100 },
    y: { stacked: true, display: false },
  },
};
</script>

<template>
  <div class="page-container">
    <div class="white-box">
      <div class="controls">
        <MonthSelector />
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

      <div class="chart-wrapper" v-if="categoryData.length">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
      <p v-else class="empty-text">선택한 월의 통계 데이터가 없습니다.</p>
    </div>

    <div class="white-box list-box" v-if="categoryData.length">
      <div class="category-list">
        <div class="list-item" v-for="item in categoryData" :key="item.key">
          <div class="item-left">
            <div class="icon">
              <img
                :src="
                  categoryIcons[normalizeCategoryKey(item.iconKey)] ||
                  categoryIcons.others
                "
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
  </div>
</template>

<style scoped>
/* 페이지 전체 여백 설정 */
.page-container {
  padding-bottom: 20px;
}

/* 🌟 공통 흰색 박스 스타일 (달력 화면과 동일) */
.white-box {
  background-color: white;
  border-radius: 16px;
  padding: 24px 20px;
  margin: 16px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
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
  background-color: var(--color-white, #ffffff);
  color: #333;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.chart-wrapper {
  width: 100%;
  height: 25px;
  margin-bottom: 10px;
}

.empty-text {
  text-align: center;
  color: #999;
  margin: 20px 0;
}

/* 리스트 간격 및 스타일 */
.list-box {
  padding-top: 20px;
  padding-bottom: 20px;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.list-item {
  display: flex;
  justify-content: space-between;
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

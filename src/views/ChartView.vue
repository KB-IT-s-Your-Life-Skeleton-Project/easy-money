<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import MonthSelector from '@/components/common/MonthSelector.vue';
import { useMonthlyTransactionStore } from '@/stores/monthlyTranscationStore';
import { useUserStore } from '@/stores/userStore';
import { getTransactions } from '@/apis/transactionApi';

const activeTab = ref('trend');
const monthlyTransactionStore = useMonthlyTransactionStore();
const userStore = useUserStore();
const { currentMonth, monthlyIncome, monthlyExpense } = storeToRefs(
  monthlyTransactionStore
);

const trendData = ref([]);
const yoyIncome = ref({ thisYear: 0, lastYear: 0 });
const yoyExpense = ref({ thisYear: 0, lastYear: 0 });

const SVG_W = 320;
const SVG_H = 180;
const PAD_L = 28;
const PAD_R = 12;
const PAD_T = 16;
const PAD_B = 24;

const getMonthRange = (yearMonth) => {
  const [year, month] = yearMonth.split('-').map(Number);
  const startDate = `${yearMonth}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${yearMonth}-${String(lastDay).padStart(2, '0')}`;
  return { startDate, endDate };
};

const shiftYearMonth = (yearMonth, delta) => {
  const [year, month] = yearMonth.split('-').map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}`;
};

const sumByType = (items, type) =>
  items
    .filter((item) => item.type === type && item.isIncluded !== false)
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

const fetchChartData = async () => {
  const userId = userStore.loginUser?.id;
  if (!userId) return;

  await monthlyTransactionStore.fetchMonthTransactions();

  const months = Array.from({ length: 6 }, (_, index) =>
    shiftYearMonth(currentMonth.value, index - 5)
  );

  const monthlyData = await Promise.all(
    months.map(async (yearMonth) => {
      const { startDate, endDate } = getMonthRange(yearMonth);
      const items = await getTransactions(userId, { startDate, endDate });
      const safeItems = Array.isArray(items) ? items : [];

      return {
        month: `${Number(yearMonth.split('-')[1])}월`,
        income: Math.round(sumByType(safeItems, 'income') / 10000),
        expense: Math.round(sumByType(safeItems, 'expense') / 10000),
      };
    })
  );

  trendData.value = monthlyData;

  const lastYearMonth = shiftYearMonth(currentMonth.value, -12);
  const { startDate, endDate } = getMonthRange(lastYearMonth);
  const lastYearItems = await getTransactions(userId, { startDate, endDate });
  const safeLastYearItems = Array.isArray(lastYearItems) ? lastYearItems : [];

  yoyIncome.value = {
    thisYear: Math.round(monthlyIncome.value / 10000),
    lastYear: Math.round(sumByType(safeLastYearItems, 'income') / 10000),
  };

  yoyExpense.value = {
    thisYear: Math.round(monthlyExpense.value / 10000),
    lastYear: Math.round(sumByType(safeLastYearItems, 'expense') / 10000),
  };
};

onMounted(fetchChartData);
watch(currentMonth, fetchChartData);

const currentMonthNumber = computed(() =>
  Number(currentMonth.value.split('-')[1])
);
const allVals = computed(() =>
  trendData.value.length
    ? trendData.value.flatMap((d) => [d.income, d.expense])
    : [0]
);
const maxVal = computed(() =>
  Math.max(50, Math.ceil(Math.max(...allVals.value) / 50) * 50)
);
const minVal = computed(() => 0);

const yGridLines = computed(() => {
  const lines = [];
  for (let v = minVal.value; v <= maxVal.value; v += 50) lines.push(v);
  return lines;
});

const xPos = (i) =>
  PAD_L +
  (i / Math.max(trendData.value.length - 1, 1)) * (SVG_W - PAD_L - PAD_R);
const yPos = (v) =>
  PAD_T +
  (1 - (v - minVal.value) / Math.max(maxVal.value - minVal.value, 1)) *
    (SVG_H - PAD_T - PAD_B);

const linePoints = (key) =>
  trendData.value.map((d, i) => `${xPos(i)},${yPos(d[key])}`).join(' ');

const areaPath = (key) => {
  const pts = trendData.value
    .map((d, i) => `${xPos(i)},${yPos(d[key])}`)
    .join(' L ');
  const bottom = SVG_H - PAD_B;
  return `M ${xPos(0)},${bottom} L ${pts} L ${xPos(
    trendData.value.length - 1
  )},${bottom} Z`;
};

const yoyBarWidth = (thisYear, lastYear) =>
  `${(thisYear / Math.max(thisYear, lastYear, 1)) * 100}%`;
</script>

<template>
  <div class="page-container">
    <div class="white-box">
      <div class="month-selector-wrap">
        <MonthSelector />
      </div>

      <div class="toggle-wrap">
        <button
          class="toggle-btn"
          :class="{ active: activeTab === 'trend' }"
          @click="activeTab = 'trend'"
        >
          최근 6개월
        </button>
        <button
          class="toggle-btn"
          :class="{ active: activeTab === 'yoy' }"
          @click="activeTab = 'yoy'"
        >
          작년 비교
        </button>
      </div>

      <Transition name="fade" mode="out-in">
        <div v-if="activeTab === 'trend'" key="trend" class="chart-content">
          <div class="chart-legend">
            <span class="legend-line income" />수입
            <span class="legend-line expense" style="margin-left: 16px" />지출
          </div>

          <div class="svg-wrap" v-if="trendData.length">
            <svg
              :viewBox="`0 0 ${SVG_W} ${SVG_H}`"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                v-for="y in yGridLines"
                :key="y"
                :x1="PAD_L"
                :y1="yPos(y)"
                :x2="SVG_W - PAD_R"
                :y2="yPos(y)"
                stroke="#f0f0f0"
                stroke-width="1"
              />
              <text
                v-for="y in yGridLines"
                :key="'lbl' + y"
                :x="PAD_L - 6"
                :y="yPos(y) + 4"
                text-anchor="end"
                font-size="9"
                fill="#bbb"
              >
                {{ y }}
              </text>

              <path :d="areaPath('income')" fill="rgba(74,144,217,0.08)" />
              <path :d="areaPath('expense')" fill="rgba(245,166,35,0.08)" />

              <polyline
                :points="linePoints('income')"
                fill="none"
                stroke="#4a90d9"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <polyline
                :points="linePoints('expense')"
                fill="none"
                stroke="#f5a623"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <circle
                v-for="(d, i) in trendData"
                :key="'ic' + i"
                :cx="xPos(i)"
                :cy="yPos(d.income)"
                r="3.5"
                fill="#4a90d9"
              />
              <circle
                v-for="(d, i) in trendData"
                :key="'ec' + i"
                :cx="xPos(i)"
                :cy="yPos(d.expense)"
                r="3.5"
                fill="#f5a623"
              />

              <text
                v-for="(d, i) in trendData"
                :key="'xl' + i"
                :x="xPos(i)"
                :y="SVG_H - 4"
                text-anchor="middle"
                font-size="10"
                fill="#aaa"
              >
                {{ d.month }}
              </text>
            </svg>
          </div>
          <p class="unit-label">단위: 만원</p>
        </div>

        <div v-else key="yoy" class="chart-content">
          <p class="yoy-title">{{ currentMonthNumber }}월 올해 vs 작년</p>

          <div class="yoy-section">
            <p class="yoy-section-label">수입</p>
            <div class="yoy-cards">
              <div class="yoy-card this-year">
                <span class="yoy-card-year"
                  >올해 {{ currentMonthNumber }}월</span
                >
                <span class="yoy-card-amount income-color">
                  {{ yoyIncome.thisYear }}만원
                </span>
              </div>
              <div class="yoy-vs">VS</div>
              <div class="yoy-card last-year">
                <span class="yoy-card-year"
                  >작년 {{ currentMonthNumber }}월</span
                >
                <span class="yoy-card-amount muted-color">
                  {{ yoyIncome.lastYear }}만원
                </span>
              </div>
            </div>
            <div class="yoy-bar-bg">
              <div
                class="yoy-bar-fill income-bg"
                :style="{
                  width: yoyBarWidth(yoyIncome.thisYear, yoyIncome.lastYear),
                }"
              />
            </div>
          </div>

          <div class="yoy-divider" />

          <div class="yoy-section">
            <p class="yoy-section-label">지출</p>
            <div class="yoy-cards">
              <div class="yoy-card this-year">
                <span class="yoy-card-year"
                  >올해 {{ currentMonthNumber }}월</span
                >
                <span class="yoy-card-amount expense-color">
                  {{ yoyExpense.thisYear }}만원
                </span>
              </div>
              <div class="yoy-vs">VS</div>
              <div class="yoy-card last-year">
                <span class="yoy-card-year"
                  >작년 {{ currentMonthNumber }}월</span
                >
                <span class="yoy-card-amount muted-color">
                  {{ yoyExpense.lastYear }}만원
                </span>
              </div>
            </div>
            <div class="yoy-bar-bg">
              <div
                class="yoy-bar-fill expense-bg"
                :style="{
                  width: yoyBarWidth(yoyExpense.thisYear, yoyExpense.lastYear),
                }"
              />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* 앱 전체 배경색은 App.vue에서 처리하므로 투명하게 둡니다 */
.page-container {
  padding-bottom: 20px;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
}

/* 🌟 공통 흰색 박스 스타일 */
.white-box {
  background-color: white;
  border-radius: 16px;
  padding: 24px 20px;
  margin: 16px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.month-selector-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.toggle-wrap {
  display: flex;
  background: #f5f5f5; /* 흰 배경에 어울리도록 살짝 밝은 회색으로 변경 */
  border-radius: 10px;
  padding: 3px;
  margin-bottom: 24px;
}
.toggle-btn {
  flex: 1;
  padding: 9px 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
}
.toggle-btn.active {
  background: #fff;
  color: var(--color-yellow-dark, #f5a623);
  font-weight: 700;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.chart-content {
  /* 내부 차트 영역은 추가 여백 없이 사용합니다 */
}

.chart-legend {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}
.legend-line {
  display: inline-block;
  width: 18px;
  height: 2.5px;
  border-radius: 2px;
  margin-right: 5px;
  vertical-align: middle;
}
.legend-line.income {
  background: #4a90d9;
}
.legend-line.expense {
  background: var(--color-yellow-dark, #f5a623);
}

.svg-wrap {
  width: 100%;
}
.svg-wrap svg {
  width: 100%;
  height: auto;
  display: block;
}

.unit-label {
  font-size: 11px;
  color: #bbb;
  text-align: right;
  margin-top: 4px;
}

.yoy-title {
  font-size: 15px;
  font-weight: 700;
  color: #333;
  margin-bottom: 18px;
}

.yoy-section-label {
  font-size: 12px;
  color: #999;
  font-weight: 600;
  margin-bottom: 10px;
}

.yoy-cards {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.yoy-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 12px 14px;
  border-radius: 12px;
}
.yoy-card.this-year {
  background: #f5f9ff;
}
.yoy-card.last-year {
  background: #f7f7f7;
}

.yoy-card-year {
  font-size: 11px;
  color: #aaa;
}
.yoy-card-amount {
  font-size: 19px;
  font-weight: 700;
}

.income-color {
  color: #4a90d9;
}
.expense-color {
  color: var(--color-yellow-dark, #f5a623);
}
.muted-color {
  color: #bbb;
}

.yoy-vs {
  font-size: 11px;
  font-weight: 700;
  color: #ccc;
  flex-shrink: 0;
}

.yoy-bar-bg {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}
.yoy-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
}
.income-bg {
  background: #4a90d9;
}
.expense-bg {
  background: var(--color-yellow-dark, #f5a623);
}

.yoy-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 16px 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>

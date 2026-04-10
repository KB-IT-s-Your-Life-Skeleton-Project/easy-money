<script setup>
import { ref, computed } from "vue";

const activeTab = ref("trend");
const currentMonth = new Date().getMonth() + 1;

// 최근 6개월 데이터 (mock)
const trendData = [
  { month: "11월", income: 280, expense: 210 },
  { month: "12월", income: 300, expense: 260 },
  { month: "1월", income: 270, expense: 190 },
  { month: "2월", income: 290, expense: 220 },
  { month: "3월", income: 310, expense: 240 },
  { month: "4월", income: 300, expense: 180 },
];

// 이번 달 vs 작년 동일 월 (mock)
const yoyIncome = { thisYear: 300, lastYear: 270 };
const yoyExpense = { thisYear: 180, lastYear: 220 };

// SVG 설정
const SVG_W = 320;
const SVG_H = 180;
const PAD_L = 28;
const PAD_R = 12;
const PAD_T = 16;
const PAD_B = 24;

const allVals = computed(() => trendData.flatMap((d) => [d.income, d.expense]));
const maxVal = computed(() => Math.ceil(Math.max(...allVals.value) / 50) * 50);
const minVal = computed(() => Math.floor(Math.min(...allVals.value) / 50) * 50);

const yGridLines = computed(() => {
  const lines = [];
  for (let v = minVal.value; v <= maxVal.value; v += 50) lines.push(v);
  return lines;
});

const xPos = (i) =>
  PAD_L + (i / (trendData.length - 1)) * (SVG_W - PAD_L - PAD_R);
const yPos = (v) =>
  PAD_T +
  (1 - (v - minVal.value) / (maxVal.value - minVal.value)) *
    (SVG_H - PAD_T - PAD_B);

const linePoints = (key) =>
  trendData.map((d, i) => `${xPos(i)},${yPos(d[key])}`).join(" ");

const areaPath = (key) => {
  const pts = trendData.map((d, i) => `${xPos(i)},${yPos(d[key])}`).join(" L ");
  const bottom = SVG_H - PAD_B;
  return `M ${xPos(0)},${bottom} L ${pts} L ${xPos(trendData.length - 1)},${bottom} Z`;
};

const yoyBarWidth = (thisYear, lastYear) =>
  `${(thisYear / Math.max(thisYear, lastYear)) * 100}%`;

// 인사이트
const insight = computed(() => {
  const cur = trendData[trendData.length - 1].expense;
  const prev = trendData[trendData.length - 2].expense;
  const diff = cur - prev;
});
</script>

<template>
  <div class="chart-page">
    <!-- 토글 -->
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
      <!-- 꺾은선 그래프 -->
      <div v-if="activeTab === 'trend'" key="trend" class="chart-wrap">
        <div class="chart-legend">
          <span class="legend-line income" />수입
          <span class="legend-line expense" style="margin-left: 16px" />지출
        </div>

        <div class="svg-wrap">
          <svg
            :viewBox="`0 0 ${SVG_W} ${SVG_H}`"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- Y축 가이드라인 -->
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
            <!-- Y축 레이블 -->
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

            <!-- 수입 영역 -->
            <path :d="areaPath('income')" fill="rgba(74,144,217,0.08)" />
            <!-- 지출 영역 -->
            <path :d="areaPath('expense')" fill="rgba(245,166,35,0.08)" />

            <!-- 수입 꺾은선 -->
            <polyline
              :points="linePoints('income')"
              fill="none"
              stroke="#4a90d9"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <!-- 지출 꺾은선 -->
            <polyline
              :points="linePoints('expense')"
              fill="none"
              stroke="#f5a623"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <!-- 수입 포인트 -->
            <circle
              v-for="(d, i) in trendData"
              :key="'ic' + i"
              :cx="xPos(i)"
              :cy="yPos(d.income)"
              r="3.5"
              fill="#4a90d9"
            />
            <!-- 지출 포인트 -->
            <circle
              v-for="(d, i) in trendData"
              :key="'ec' + i"
              :cx="xPos(i)"
              :cy="yPos(d.expense)"
              r="3.5"
              fill="#f5a623"
            />

            <!-- X축 레이블 -->
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

      <!-- 작년 동일 월 비교 -->
      <div v-else key="yoy" class="chart-wrap">
        <p class="yoy-title">{{ currentMonth }}월 올해 vs 작년</p>

        <!-- 수입 비교 -->
        <div class="yoy-section">
          <p class="yoy-section-label">수입</p>
          <div class="yoy-cards">
            <div class="yoy-card this-year">
              <span class="yoy-card-year">올해 {{ currentMonth }}월</span>
              <span class="yoy-card-amount income-color"
                >{{ yoyIncome.thisYear }}만원</span
              >
            </div>
            <div class="yoy-vs">VS</div>
            <div class="yoy-card last-year">
              <span class="yoy-card-year">작년 {{ currentMonth }}월</span>
              <span class="yoy-card-amount muted-color"
                >{{ yoyIncome.lastYear }}만원</span
              >
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
          <p
            class="yoy-diff-text"
            :class="
              yoyIncome.thisYear >= yoyIncome.lastYear ? 'positive' : 'negative'
            "
          >
            {{ yoyIncome.thisYear >= yoyIncome.lastYear ? "▲" : "▼" }}
            작년보다 {{ Math.abs(yoyIncome.thisYear - yoyIncome.lastYear) }}만원
            {{
              yoyIncome.thisYear >= yoyIncome.lastYear
                ? "더 벌었어요"
                : "덜 벌었어요"
            }}
          </p>
        </div>

        <div class="yoy-divider" />

        <!-- 지출 비교 -->
        <div class="yoy-section">
          <p class="yoy-section-label">지출</p>
          <div class="yoy-cards">
            <div class="yoy-card this-year">
              <span class="yoy-card-year">올해 {{ currentMonth }}월</span>
              <span class="yoy-card-amount expense-color"
                >{{ yoyExpense.thisYear }}만원</span
              >
            </div>
            <div class="yoy-vs">VS</div>
            <div class="yoy-card last-year">
              <span class="yoy-card-year">작년 {{ currentMonth }}월</span>
              <span class="yoy-card-amount muted-color"
                >{{ yoyExpense.lastYear }}만원</span
              >
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
          <p
            class="yoy-diff-text"
            :class="
              yoyExpense.thisYear <= yoyExpense.lastYear
                ? 'positive'
                : 'negative'
            "
          >
            {{ yoyExpense.thisYear <= yoyExpense.lastYear ? "▼" : "▲" }}
            작년보다
            {{ Math.abs(yoyExpense.thisYear - yoyExpense.lastYear) }}만원
            {{
              yoyExpense.thisYear <= yoyExpense.lastYear
                ? "절약했어요"
                : "더 썼어요"
            }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.chart-page {
  padding: 20px 16px;
  background: #f8f9fb;
  min-height: 100vh;
  font-family: "Pretendard", "Apple SD Gothic Neo", sans-serif;
}

.insight-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border-radius: 14px;
  padding: 16px 18px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.insight-emoji {
  font-size: 24px;
}
.insight-text {
  font-size: 15px;
  font-weight: 600;
  color: #222;
  line-height: 1.4;
}

.toggle-wrap {
  display: flex;
  background: #e8edf2;
  border-radius: 10px;
  padding: 3px;
  margin-bottom: 20px;
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
  color: var(--color--yellow-dark, #f5a623);
  font-weight: 700;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.chart-wrap {
  background: #fff;
  border-radius: 16px;
  padding: 20px 16px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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
  background: var(--color--yellow-dark, #f5a623);
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

/* 작년 비교 */
.yoy-title {
  font-size: 15px;
  font-weight: 700;
  color: #333;
  margin-bottom: 18px;
}

.yoy-section {
  margin-bottom: 4px;
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
  color: var(--color--yellow-dark, #f5a623);
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
  background: var(--color--yellow-dark, #f5a623);
}

.yoy-diff-text {
  font-size: 12px;
  font-weight: 600;
  text-align: right;
  margin-bottom: 4px;
}
.yoy-diff-text.positive {
  color: #4a90d9;
}
.yoy-diff-text.negative {
  color: #f06060;
}

.yoy-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 16px 0;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
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

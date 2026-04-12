<script setup>
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useMonthlyTransactionStore } from '@/stores/monthlyTranscationStore';
import { getTransactions } from '@/apis/transactionApi';

const monthlyTransactionStore = useMonthlyTransactionStore();

// 스토어에서 이번 달 데이터와 유저 정보 가져오기
const { userId, currentMonth, monthlyIncome, monthlyExpense } = storeToRefs(
  monthlyTransactionStore
);

// 컴포넌트 내부에서만 사용할 지난달 지출 상태 (Local State)
const lastMonthExpense = ref(0);

// --- 유틸리티 함수 ---
// (스토어에 있는 함수와 동일한 로직을 컴포넌트 내부에 선언하여 독립적으로 사용합니다)
const shiftYearMonth = (yearMonth, delta) => {
  const [year, month] = yearMonth.split('-').map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}`;
};

const getMonthRange = (yearMonth) => {
  const [year, month] = yearMonth.split('-').map(Number);
  const startDate = `${yearMonth}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${yearMonth}-${String(lastDay).padStart(2, '0')}`;
  return { startDate, endDate };
};

// --- 지난달 데이터 호출 로직 ---
const fetchLastMonthData = async (monthStr) => {
  if (!userId.value) return;

  // 1. 기준 월(monthStr)에서 1개월을 뺀 '지난달' 연월 문자열 구하기
  const lastMonthStr = shiftYearMonth(monthStr, -1);
  // 2. 지난달의 시작일과 종료일 구하기
  const { startDate, endDate } = getMonthRange(lastMonthStr);

  try {
    // 3. API 호출
    const data = await getTransactions(userId.value, { startDate, endDate });

    // 4. 지출 총액 계산하여 로컬 상태에 저장
    if (Array.isArray(data)) {
      lastMonthExpense.value = data
        .filter((item) => item.type === 'expense' && item.isIncluded !== false)
        .reduce((sum, item) => sum + Number(item.amount || 0), 0);
    } else {
      lastMonthExpense.value = 0;
    }
  } catch (error) {
    console.error('지난달 데이터 조회 실패:', error);
    lastMonthExpense.value = 0;
  }
};

// --- 감시자(Watcher) ---
// 스토어의 currentMonth가 바뀔 때마다 fetchLastMonthData 함수를 실행합니다.
// immediate: true 옵션으로 인해 컴포넌트가 처음 화면에 렌더링될 때도 즉시 1회 실행됩니다.
watch(
  currentMonth,
  (newMonth) => {
    if (newMonth) {
      fetchLastMonthData(newMonth);
    }
  },
  { immediate: true }
);

// --- UI 렌더링용 계산 속성 ---
const balance = computed(() => monthlyIncome.value - monthlyExpense.value);
const isPlus = computed(() => balance.value > 0);

const diffAmount = computed(() =>
  Math.abs(monthlyExpense.value - lastMonthExpense.value)
);
// 이번 달 지출이 지난달 지출보다 작거나 같으면 '덜' 쓰는 중
const isLess = computed(() => monthlyExpense.value <= lastMonthExpense.value);
</script>

<template>
  <div class="summary-card">
    <div class="summary-left">
      <div class="total-amount">
        {{ isPlus ? '+' : '' }} {{ balance.toLocaleString() }} 원
      </div>

      <div v-if="lastMonthExpense > 0" class="comparison-text">
        지난달보다
        <span :class="['highlight', isLess ? 'text-blue' : 'text-red']">
          {{ diffAmount.toLocaleString() }}원 {{ isLess ? '덜' : '더' }}
        </span>
        쓰는 중
      </div>
      <div v-else class="comparison-text">이번 달부터 꼼꼼히 기록해봐요!</div>
    </div>

    <div class="summary-right">
      <div class="stat-row">
        <span class="label">수입</span>
        <span class="income">+ {{ monthlyIncome.toLocaleString() }}원</span>
      </div>
      <div class="stat-row">
        <span class="label">지출</span>
        <span class="expense">- {{ monthlyExpense.toLocaleString() }}원</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary-card {
  background-color: white;
  border-radius: 16px;
  padding: 24px 20px;
  margin: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.summary-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.total-amount {
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.comparison-text {
  font-size: 13px;
  color: #888;
}

.text-blue {
  color: #4a90e2;
}
.text-red {
  color: #e74c3c;
}
.highlight {
  font-weight: 600;
}

.summary-right {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.label {
  color: #555;
  font-weight: 500;
}

.income {
  color: #2ecc71;
}

.expense {
  color: #e74c3c;
}
</style>

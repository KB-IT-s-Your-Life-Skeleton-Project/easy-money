<script setup>
import { ref, computed } from 'vue';

/**
 * 선택된 날짜
 */
const selectedDate = ref(new Date());

/**
 * 오늘 날짜
 */
const today = new Date();

/**
 * 예시 거래 데이터
 * 실제로는 API 응답으로 교체
 */
const transactions = ref([
  { id: 1, date: '2026-04-06', type: 'expense', amount: 9000 },
  { id: 2, date: '2026-04-06', type: 'income', amount: 30000 },
  { id: 3, date: '2026-04-09', type: 'income', amount: 50000 },
  { id: 4, date: '2026-04-09', type: 'expense', amount: 12000 },
  { id: 5, date: '2026-04-10', type: 'expense', amount: 22000 },
]);

/**
 * Date -> YYYY-MM-DD
 */
const format = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 금액 포맷
 */
const money = (value) => value.toLocaleString('ko-KR');

/**
 * 날짜 동일 여부
 */
const isSame = (a, b) => {
  if (!a || !b) return false;
  return format(a) === format(b);
};

/**
 * 날짜별 수입/지출 합계
 */
const summary = computed(() => {
  const map = {};

  for (const transaction of transactions.value) {
    if (!map[transaction.date]) {
      map[transaction.date] = {
        income: 0,
        expense: 0,
      };
    }

    if (transaction.type === 'income') {
      map[transaction.date].income += transaction.amount;
    } else if (transaction.type === 'expense') {
      map[transaction.date].expense += transaction.amount;
    }
  }

  return map;
});

/**
 * 날짜 클릭
 */
const selectDate = (day) => {
  selectedDate.value = day.date;
};
</script>

<template>
  <div class="w-full px-[4%] py-[2svh]">
    <div
      class="w-full rounded-[1.25rem] bg-white p-[clamp(0.875rem,3vw,1rem)] shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
    >
      <VCalendar
        borderless
        expanded
        title-position="left"
        locale="ko"
        :initial-page="initialPage"
      >
        <template #day-content="{ day }">
          <div
            class="flex min-h-[clamp(3.25rem,11vw,4.5rem)] w-full cursor-pointer flex-col items-center justify-start px-[1%] py-[0.4svh]"
            @click.stop="selectDate(day)"
          >
            <!-- 날짜 -->
            <div class="mb-[0.2rem] flex w-full justify-center">
              <div
                class="flex h-[clamp(1.75rem,7vw,2rem)] w-[clamp(1.75rem,7vw,2rem)] items-center justify-center rounded-full text-[clamp(0.875rem,3.6vw,1rem)] font-medium leading-none"
                :class="{
                  'bg-expense text-white font-bold': isSame(
                    day.date,
                    selectedDate,
                  ),
                  'bg-gray text-black':
                    !isSame(day.date, selectedDate) && isSame(day.date, today),
                  'text-gray': !day.inMonth,
                  'text-black':
                    day.inMonth &&
                    !isSame(day.date, selectedDate) &&
                    !isSame(day.date, today),
                }"
              >
                {{ day.day }}
              </div>
            </div>

            <!-- 총 수입 / 지출 -->
            <div
              v-if="summary[format(day.date)] && day.inMonth"
              class="flex min-h-[clamp(0.95rem,3vw,1.5rem)] flex-col items-center justify-center gap-[1px] text-center"
            >
              <span
                v-if="summary[format(day.date)].income > 0"
                class="whitespace-nowrap text-[clamp(0.45rem,1.9vw,0.625rem)] font-semibold leading-[1.1] text-income"
              >
                +{{ money(summary[format(day.date)].income) }}
              </span>

              <span
                v-if="summary[format(day.date)].expense > 0"
                class="whitespace-nowrap text-[clamp(0.45rem,1.9vw,0.625rem)] font-semibold leading-[1.1] text-expense"
              >
                -{{ money(summary[format(day.date)].expense) }}
              </span>
            </div>
          </div>
        </template>
      </VCalendar>
    </div>
  </div>
</template>

<style>
/* VCalendar 전체 */
.vc-container {
  width: 100%;
  border: none !important;
  background: transparent !important;
  font-family: 'Pretendard', system-ui, sans-serif !important;
}

/* 헤더 여백 */
.vc-header {
  padding: 0 0 0.5rem 0 !important;
}

/* 타이틀 */
.vc-title {
  font-family: 'Pretendard', system-ui, sans-serif !important;
  color: var(--color-black) !important;
  font-size: clamp(1rem, 4vw, 1.125rem) !important;
  font-weight: 700 !important;
}

/* 화살표 버튼 */
.vc-arrow {
  background: transparent !important;
  border: none !important;
  border-radius: 9999px !important;
}

.vc-arrow:hover {
  background: transparent !important;
}

.vc-arrow svg {
  color: var(--color-arrow) !important;
}

/* 요일 행 */
.vc-weekdays {
  display: grid !important;
  grid-template-columns: repeat(7, 1fr);
}

/* 요일 */
.vc-weekday {
  text-align: center !important;
  font-family: 'Pretendard', system-ui, sans-serif !important;
  font-size: clamp(0.65rem, 2.4vw, 0.75rem) !important;
  font-weight: 600 !important;
  color: var(--color-gray) !important;
}

/* 기본 선택 배경 제거 */
.vc-day,
.vc-day-content,
.vc-highlight,
.vc-day-layer {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
</style>

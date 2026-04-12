<script setup>
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useMonthlyTransactionStore } from '@/stores/monthlyTranscationStore';
import { formatLocalDate, formatLocalYearMonth } from '@/utils/date';

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(['update:modelValue']);
const monthlyTransactionStore = useMonthlyTransactionStore();
const { currentMonth } = storeToRefs(monthlyTransactionStore);

const today = new Date();
const todayString = formatLocalDate(today);

/**
 * Date -> YYYY-MM-DD
 */
const format = (date) => {
  const safeDate = typeof date === "string" ? new Date(date) : date;
  const year = safeDate.getFullYear();
  const month = String(safeDate.getMonth() + 1).padStart(2, '0');
  const day = String(safeDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDate = (dateString) => {
  if (!dateString) return new Date();
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const getDefaultDate = () => `${currentMonth.value}-01`;
const getPreferredDate = () =>
  currentMonth.value === formatLocalYearMonth(today)
    ? todayString
    : getDefaultDate();

const selectedDate = ref(parseDate(props.modelValue || getPreferredDate()));

watch(
  () => props.modelValue,
  (value) => {
    selectedDate.value = parseDate(value || getPreferredDate());
  },
);

watch(
  () => props.items,
  (items) => {
    if (props.modelValue) return;

    const preferredDate = getPreferredDate();
    selectedDate.value = parseDate(preferredDate);
    emit('update:modelValue', preferredDate);
  },
  { immediate: true },
);

const initialPage = computed(() => ({
  month: Number(currentMonth.value.split('-')[1]),
  year: Number(currentMonth.value.split('-')[0]),
}));

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

  for (const transaction of props.items) {
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
  emit('update:modelValue', format(day.date));
};

const handlePageUpdate = async (pages) => {
  const currentPage = Array.isArray(pages) ? pages[0] : pages;
  if (!currentPage?.year || !currentPage?.month) return;

  const nextMonth = `${currentPage.year}-${String(currentPage.month).padStart(2, '0')}`;
  if (currentMonth.value === nextMonth) return;

  await monthlyTransactionStore.setCurrentMonth(nextMonth);
};
</script>

<template>
  <VCalendar
    borderless
    expanded
    title-position="left"
    locale="ko"
    :initial-page="initialPage"
    @update:pages="handlePageUpdate"
  >
    <template #day-content="{ day }">
      <div
        class="flex min-h-[clamp(2.55rem,8.6vw,3.35rem)] w-full cursor-pointer flex-col items-center justify-start px-[1%] py-[0.1rem]"
        @click.stop="selectDate(day)"
      >
        <div class="mb-[0.05rem] flex w-full justify-center">
          <div
            class="flex h-[clamp(1.6rem,6.2vw,1.9rem)] w-[clamp(1.6rem,6.2vw,1.9rem)] items-center justify-center rounded-full text-[clamp(0.82rem,3.2vw,0.95rem)] font-medium leading-none"
            :class="{
              'bg-expense text-white font-bold': isSame(day.date, selectedDate),
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

        <div
          v-if="summary[format(day.date)] && day.inMonth"
          class="flex min-h-[0.72rem] flex-col items-center justify-center gap-0 text-center"
        >
          <span
            v-if="summary[format(day.date)].income > 0"
            class="whitespace-nowrap text-[clamp(0.42rem,1.7vw,0.56rem)] font-semibold leading-[1.05] text-income"
          >
            +{{ money(summary[format(day.date)].income) }}
          </span>

          <span
            v-if="summary[format(day.date)].expense > 0"
            class="whitespace-nowrap text-[clamp(0.42rem,1.7vw,0.56rem)] font-semibold leading-[1.05] text-expense"
          >
            -{{ money(summary[format(day.date)].expense) }}
          </span>
        </div>
      </div>
    </template>
  </VCalendar>
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
  padding: 0 0 0.2rem 0 !important;
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
  margin-bottom: 0.05rem !important;
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

.vc-weeks {
  padding-bottom: 0 !important;
}

.vc-pane-layout {
  padding-bottom: 0 !important;
}
</style>

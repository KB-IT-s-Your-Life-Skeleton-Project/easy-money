<script setup>
import { computed } from 'vue';

const props = defineProps({
  // 전체 내역 데이터를 배열로 받습니다.
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
});

// [핵심] 데이터를 날짜별로 묶어주는 로직 (컴퓨티드 속성)
const groupedItems = computed(() => {
  const groups = {};

  props.items.forEach((item) => {
    // 날짜를 키값으로 사용 (예: "2026-04-06")
    if (!groups[item.date]) {
      groups[item.date] = [];
    }
    groups[item.date].push(item);
  });

  return groups;
});

// 날짜 문자열을 "4월 6일 월요일" 형식으로 바꿔주는 함수
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
};
</script>

<template>
  <div class="transaction-list">
    <div v-for="(records, date) in groupedItems" :key="date" class="pt-6">
      <h3 class="px-6 text-sm font-medium text-gray-400 mb-2">
        {{ formatDate(date) }}
      </h3>

      <div
        v-for="(item, index) in records"
        :key="item.id"
        class="flex items-center justify-between px-6 py-4 active:bg-gray-50 transition-colors"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl overflow-hidden"
          >
            💰
          </div>

          <div>
            <div class="flex flex-col">
              <span
                class="font-bold text-lg"
                :class="
                  item.type === 'income' ? 'text-blue-500' : 'text-slate-900'
                "
              >
                {{ item.type === 'expense' ? '-' : '+' }}
                {{ item.amount.toLocaleString() }} 원
              </span>
              <span class="text-xs text-gray-400 mt-0.5">
                {{ item.location }} | {{ item.memo }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

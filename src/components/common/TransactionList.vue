<script setup>
import { computed } from "vue";
// 1. 아이콘과 색상 설정 파일을 불러옵니다. (경로는 프로젝트에 맞게 확인해주세요!)
import { categoryIcons } from "@/constants/categoryIcons.js";
import { categoryColors } from "@/constants/categoryColors.js";

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const groupedItems = computed(() => {
  const groups = {};
  props.items.forEach((item) => {
    if (!groups[item.date]) {
      groups[item.date] = [];
    }
    groups[item.date].push(item);
  });
  return groups;
});

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

const getTransactionDescription = (item) => {
  if (item.content && item.memo) return `${item.content} | ${item.memo}`;
  return item.memo || item.location || "";
};

// 2. 카테고리에 맞는 아이콘을 찾아주는 함수
const getCategoryIcon = (category) => {
  return categoryIcons[category] || null; // 일치하는 아이콘이 없으면 null 반환
};

// 3. 카테고리와 타입(income/expense)에 맞는 배경색을 찾아주는 함수
const getCategoryColor = (type, category) => {
  // 색상표에 해당 타입과 카테고리가 존재하면 그 색상을, 없으면 기본 회색 반환
  if (categoryColors[type] && categoryColors[type][category]) {
    return categoryColors[type][category];
  }
  return "#f3f4f6"; // 기본 배경색 (bg-gray-100과 동일한 색상)
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
            class="w-12 h-12 rounded-full flex items-center justify-center text-xl overflow-hidden"
            :style="{ backgroundColor: getCategoryColor(item.type, item.category) }"
          >
            <img 
              v-if="getCategoryIcon(item.category)" 
              :src="getCategoryIcon(item.category)" 
              class="w-12 h-12" 
              alt="category icon"
            />
            <span v-else>💰</span>
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
                {{ getTransactionDescription(item) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
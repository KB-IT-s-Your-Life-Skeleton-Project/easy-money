<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { categoryIcons } from '@/constants/categoryIcons';
import { getCategoryColor, normalizeCategoryKey } from '@/constants/categoryMeta';

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const router = useRouter();

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
  return date.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
};

const getTransactionDescription = (item) => {
  if (item.content && item.memo) return `${item.content} | ${item.memo}`;
  return item.content || item.memo || item.location || '';
};

const goDetail = (id) => {
  router.push(`/transaction/detail/${id}`);
};

const getCategoryIcon = (category) => {
  return categoryIcons[normalizeCategoryKey(category)] || null;
};
</script>

<template>
  <div class="transaction-list">
    <div v-for="(records, date) in groupedItems" :key="date" class="pt-6">
      <h3 class="px-6 text-sm font-medium text-gray-400 mb-2">
        {{ formatDate(date) }}
      </h3>

      <div
        v-for="item in records"
        :key="item.id"
        class="flex items-center justify-between px-6 py-4 active:bg-gray-50 transition-colors cursor-pointer"
        @click="goDetail(item.id)"
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

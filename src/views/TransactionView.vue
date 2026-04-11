<script setup>
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import FilterBar from '@/components/FilterBar.vue';
import FilterModal from '@/components/FilterModal.vue';
import TransactionList from '@/components/common/TransactionList.vue';
import { useUserStore } from '@/stores/userStore';
import { getTransactions } from '@/apis/transactionApi';

const userStore = useUserStore();
const { loginUser } = storeToRefs(userStore);

const transactions = ref([]);
const isModalOpen = ref(false);
const filterPeriod = ref('1개월');
const filterType = ref('전체');

const periodLabels = {
  '1week': '1주일',
  '1month': '1개월',
  '3month': '3개월',
  monthly: '월별',
  custom: '직접설정',
};

const typeLabels = {
  all: '전체',
  income: '입금',
  expense: '출금',
};

const fetchTransactions = async () => {
  if (!loginUser.value?.id) {
    transactions.value = [];
    return;
  }

  const data = await getTransactions(loginUser.value.id);
  transactions.value = Array.isArray(data) ? data : [];
};

onMounted(fetchTransactions);

const handleFilter = ({ period, type }) => {
  filterPeriod.value = periodLabels[period] ?? '1개월';
  filterType.value = typeLabels[type] ?? '전체';
};

const filteredTransactions = computed(() => {
  if (filterType.value === '전체') {
    return transactions.value;
  }

  const typeMap = { 입금: 'income', 출금: 'expense' };
  return transactions.value.filter(
    (item) => item.type === typeMap[filterType.value],
  );
});
</script>

<template>
  <div class="min-h-screen no-scrollbar bg-gray-50 pb-24">
    <section class="px-6 py-4">
      <FilterBar
        :period="filterPeriod"
        :type="filterType"
        @open="isModalOpen = true"
      />
      <FilterModal
        v-model="isModalOpen"
        :period="filterPeriod"
        :type="filterType"
        @submit="handleFilter"
      />
    </section>

    <main class="px-6">
      <div
        class="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden mb-10"
      >
        <TransactionList :items="filteredTransactions" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

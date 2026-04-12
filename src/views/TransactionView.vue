<script setup>
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import FilterBar from '@/components/FilterBar.vue';
import FilterModal from '@/components/FilterModal.vue';
import TransactionList from '@/components/common/TransactionList.vue';
import { useUserStore } from '@/stores/userStore';
import { getTransactions } from '@/apis/transactionApi';
import { normalizeCategoryKey } from '@/constants/categoryMeta';
import { formatLocalDate } from '@/utils/date';

const userStore = useUserStore();
const { loginUser } = storeToRefs(userStore);

const transactions = ref([]);
const isModalOpen = ref(false);
const filterPeriod = ref('1개월');
const filterType = ref('전체');
const filterOptions = ref({
  period: '1month',
  startDate: '',
  endDate: '',
  year: null,
  month: null,
  type: 'all',
  category: [],
});

const periodLabels = {
  '1week': '1주일',
  '1month': '1개월',
  '3month': '3개월',
  monthly: '월별',
  custom: '직접설정',
};

const typeLabels = {
  all: '전체',
  income: '수입',
  expense: '지출',
};

const fetchTransactions = async () => {
  if (!loginUser.value?.id) {
    transactions.value = [];
    return;
  }

  const { period, startDate, endDate, year, month, type, category } =
    filterOptions.value;

  const query = {};

  if (type && type !== 'all') {
    query.type = type;
  }

  if (Array.isArray(category) && category.length) {
    query.category = category.map((item) => normalizeCategoryKey(item));
  }

  try {
    if (period === 'custom' && startDate && endDate) {
      query.startDate = startDate;
      query.endDate = endDate;
    } else if (period === 'monthly' && year && month) {
      const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
      query.startDate = `${yearMonth}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      query.endDate = `${yearMonth}-${String(lastDay).padStart(2, '0')}`;
    } else if (period === '1week' || period === '1month' || period === '3month') {
      const today = new Date();
      const start = new Date(today);

      if (period === '1week') start.setDate(today.getDate() - 6);
      if (period === '1month') start.setMonth(today.getMonth() - 1);
      if (period === '3month') start.setMonth(today.getMonth() - 3);

      query.startDate = formatLocalDate(start);
      query.endDate = formatLocalDate(today);
    }

    const data = await getTransactions(loginUser.value.id, query);
    transactions.value = Array.isArray(data) ? data : [];
  } catch (err) {
    transactions.value = [];
    alert(err.message || '거래내역 조회에 실패했습니다.');
  }
};

onMounted(fetchTransactions);

const handleFilter = (payload) => {
  filterOptions.value = payload;
  filterPeriod.value = periodLabels[payload.period] ?? '1개월';
  filterType.value = typeLabels[payload.type] ?? '전체';
  fetchTransactions();
};

const filteredTransactions = computed(() => {
  return transactions.value;
});
</script>

<template>
  <div class="min-h-screen no-scrollbar bg-[#f5f6f8] pb-24">
    <section class="px-6 pt-0 pb-2">
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

.white-box {
  background-color: white;
  border-radius: 16px;
  margin: 0 20px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}
</style>

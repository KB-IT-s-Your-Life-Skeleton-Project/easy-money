<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router"; // 1. Router 연결
import { useUserStore } from "@/stores/userStore.js"; // 2. Store 연결

import FilterBar from "@/components/FilterBar.vue";
import FilterModal from "@/components/FilterModal.vue";
import TransactionList from "@/components/common/TransactionList.vue";

const router = useRouter();
const userStore = useUserStore();

// 1. 상태 관리 (초기값은 비워두거나 0으로 설정)
const transactions = ref([]);
const totalBalance = ref(0);
const totalIncome = ref(0);
const totalExpense = ref(0);

// 2. DB 연결: 컴포넌트가 켜질 때 json-server에서 데이터 가져오기
onMounted(async () => {
  try {
    // 팁: 나중에는 `http://localhost:3000/transactions?userId=${userStore.user.id}` 처럼
    // 로그인한 유저의 데이터만 가져오도록 응용할 수 있습니다.
    const response = await fetch("http://localhost:3000/transactions");
    const data = await response.json();
    
    transactions.value = data;

  } catch (error) {
    console.error("DB에서 데이터를 불러오는데 실패했습니다:", error);
  }
});

const isModalOpen = ref(false);
const filterPeriod = ref("1개월");
const filterType = ref("전체");

const periodLabels = {
  "1week": "1주일",
  "1month": "1개월",
  "3month": "3개월",
  monthly: "월별",
  custom: "직접설정",
};

const typeLabels = {
  all: "전체",
  income: "입금",
  expense: "출금",
};

const handleFilter = ({ period, type }) => {
  filterPeriod.value = periodLabels[period] ?? "1개월";
  filterType.value = typeLabels[type] ?? "전체";
};

// 3. 필터링 및 최신순 정렬(내림차순) 로직
const filteredTransactions = computed(() => {
  let result = transactions.value;

  // [필터링] 입금/출금 구분
  if (filterType.value !== "전체") {
    const typeMap = { 입금: "income", 출금: "expense" };
    result = result.filter(
      (item) => item.type === typeMap[filterType.value]
    );
  }

  // [정렬] 날짜 기준 내림차순 (최신 날짜가 위로 오게)
  return result.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
});
</script>

<template>
  <div class="min-h-screen no-scrollbar bg-gray-50 pb-24">
    <header>
    </header>

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
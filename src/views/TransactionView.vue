<script setup>
import { ref, onMounted, computed } from "vue";
import FilterBar from "@/components/FilterBar.vue";
import FilterModal from "@/components/FilterModal.vue";
import TransactionList from "@/components/common/TransactionList.vue";

// 1. 상태 관리 (나중에는 서버에서 받아올 데이터)
const transactions = ref([]);
const totalBalance = ref(600000); // 시안의 + 600,000 원
const totalIncome = ref(1000000);
const totalExpense = ref(400000);

// 2. 더미 데이터 로드 (아까 만든 데이터들)
onMounted(() => {
  transactions.value = [
    {
      id: 1,
      type: 'income',
      amount: 3000000,
      date: '2026-04-01',
      categoryName: '월급',
      location: '회사',
      memo: '4월 정기 급여',
      isIncluded: true,
    },
    {
      id: 2,
      type: 'expense',
      amount: 12000,
      date: '2026-04-01',
      categoryName: '음식',
      location: '김밥천국',
      memo: '라돈세트',
      isIncluded: true,
    },
    {
      id: 3,
      type: 'expense',
      amount: 4500,
      date: '2026-04-02',
      categoryName: '음식',
      location: '빽다방',
      memo: '아이스 아메리카노',
      isIncluded: true,
    },
    {
      id: 4,
      type: 'expense',
      amount: 15000,
      date: '2026-04-02',
      categoryName: '쇼핑',
      location: '다이소',
      memo: '자취 필수품',
      isIncluded: true,
    },
    {
      id: 5,
      type: 'expense',
      amount: 8000,
      date: '2026-04-03',
      categoryName: '음식',
      location: '맥도날드',
      memo: '상하이 버거',
      isIncluded: true,
    },
    {
      id: 6,
      type: 'expense',
      amount: 55000,
      date: '2026-04-04',
      categoryName: '쇼핑',
      location: '지그재그',
      memo: '봄 원피스',
      isIncluded: true,
    },
    {
      id: 7,
      type: 'expense',
      amount: 2500,
      date: '2026-04-04',
      categoryName: '교통',
      location: '시내버스',
      memo: '친구 보러 가는 길',
      isIncluded: true,
    },
    {
      id: 8,
      type: 'expense',
      amount: 35000,
      date: '2026-04-05',
      categoryName: '음식',
      location: '마라탕집',
      memo: '꿔바로우 추가',
      isIncluded: true,
    },
    {
      id: 9,
      type: 'expense',
      amount: 9000,
      date: '2026-04-06',
      categoryName: '음식',
      location: '버거킹 성남이마트점',
      memo: '통새우와퍼',
      isIncluded: true,
    },
    {
      id: 10,
      type: 'expense',
      amount: 9000,
      date: '2026-04-06',
      categoryName: '음식',
      location: '버거킹 성남이마트점',
      memo: '통새우와퍼',
      isIncluded: true,
    },
    {
      id: 11,
      type: 'expense',
      amount: 9000,
      date: '2026-04-06',
      categoryName: '음식',
      location: '버거킹 성남이마트점',
      memo: '통새우와퍼',
      isIncluded: true,
    },
    {
      id: 12,
      type: 'expense',
      amount: 4500,
      date: '2026-04-07',
      categoryName: '음식',
      location: '스타벅스',
      memo: '아메리카노',
      isIncluded: true,
    },
    {
      id: 13,
      type: 'expense',
      amount: 1250,
      date: '2026-04-07',
      categoryName: '교통',
      location: '지하철',
      memo: '퇴근',
      isIncluded: true,
    },
    {
      id: 14,
      type: 'income',
      amount: 50000,
      date: '2026-04-08',
      categoryName: '기타',
      location: '당근마켓',
      memo: '안 쓰는 에어팟 판매',
      isIncluded: true,
    },
    {
      id: 15,
      type: 'expense',
      amount: 32000,
      date: '2026-04-08',
      categoryName: '음식',
      location: '치킨뱅이',
      memo: '치맥 정산',
      isIncluded: true,
    },
    {
      id: 16,
      type: 'expense',
      amount: 5000,
      date: '2026-04-09',
      categoryName: '기타',
      location: '인생네컷',
      memo: '친구랑 사진',
      isIncluded: true,
    },
    {
      id: 17,
      type: 'expense',
      amount: 1500,
      date: '2026-04-09',
      categoryName: '음식',
      location: '편의점',
      memo: '삼각김밥',
      isIncluded: true,
    },
    {
      id: 18,
      type: 'expense',
      amount: 1200,
      date: '2026-04-09',
      categoryName: '음식',
      location: '편의점',
      memo: '생수',
      isIncluded: true,
    },
    {
      id: 19,
      type: 'expense',
      amount: 2000,
      date: '2026-04-09',
      categoryName: '교통',
      location: '따릉이',
      memo: '운동 겸 귀가',
      isIncluded: true,
    },
    {
      id: 20,
      type: 'expense',
      amount: 10000,
      date: '2026-04-10',
      categoryName: '문화',
      location: '독립서점',
      memo: '에세이 구매',
      isIncluded: true,
    },
    {
      id: 21,
      type: 'expense',
      amount: 7500,
      date: '2026-04-10',
      categoryName: '음식',
      location: '서브웨이',
      memo: '에그마요 꿀조합',
      isIncluded: true,
    },
    {
      id: 22,
      type: 'income',
      amount: 10000,
      date: '2026-04-11',
      categoryName: '기타',
      location: '엄마',
      memo: '용돈 최고',
      isIncluded: true,
    },
    {
      id: 23,
      type: 'expense',
      amount: 45000,
      date: '2026-04-11',
      categoryName: '쇼핑',
      location: '올리브영',
      memo: '화장품 털기',
      isIncluded: true,
    },
    {
      id: 26,
      type: 'expense',
      amount: 6000,
      date: '2026-04-13',
      categoryName: '음식',
      location: '이삭토스트',
      memo: '햄치즈 스페셜',
      isIncluded: true,
    },
    {
      id: 27,
      type: 'expense',
      amount: 1250,
      date: '2026-04-13',
      categoryName: '교통',
      location: '지하철',
      memo: '출근길',
      isIncluded: true,
    },
    {
      id: 28,
      type: 'expense',
      amount: 8900,
      date: '2026-04-14',
      categoryName: '기타',
      location: '넷플릭스',
      memo: '구독료 결제',
      isIncluded: true,
    },
    {
      id: 29,
      type: 'expense',
      amount: 13000,
      date: '2026-04-15',
      categoryName: '음식',
      location: '마라탕',
      memo: '0.5단계',
      isIncluded: true,
    },
    {
      id: 30,
      type: 'income',
      amount: 25000,
      date: '2026-04-15',
      categoryName: '기타',
      location: '중고나라',
      memo: '책 판매',
      isIncluded: true,
    },
  ];
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

// 2. [추가] 필터링된 데이터를 만들어주는 계산기(computed)를 만듭니다.
const filteredTransactions = computed(() => {
  if (filterType.value === "전체") {
    return transactions.value;
  }
  const typeMap = { 입금: "income", 출금: "expense" };
  return transactions.value.filter(
    (item) => item.type === typeMap[filterType.value],
  );
});
</script>

<template>
  <div class="min-h-screen no-scrollbar bg-gray-50 pb-24">
    <header class="p-6 bg-white flex flex-col gap-4">
      <div class="flex items-center gap-1 text-lg font-bold">
        4월 <span class="text-sm">▼</span>
      </div>

      <div class="bg-white rounded-[28px] p-6 shadow-xl border border-gray-100">
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="text-2xl font-black text-slate-900">
              + {{ totalBalance.toLocaleString() }} 원
            </div>
            <div class="text-xs text-blue-500 mt-1 font-medium">
              지난달보다 100,000원 덜 쓰는 중
            </div>
          </div>
          <div class="text-right text-xs space-y-1">
            <div class="text-gray-400">
              수입
              <span class="text-green-500 font-bold ml-1"
                >+ {{ totalIncome.toLocaleString() }}원</span
              >
            </div>
            <div class="text-gray-400">
              지출
              <span class="text-red-500 font-bold ml-1"
                >- {{ totalExpense.toLocaleString() }}원</span
              >
            </div>
          </div>
        </div>
      </div>
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

    <div class="fixed bottom-6 left-0 w-full px-6">
      <div
        class="h-14 bg-yellow-400 rounded-2xl shadow-lg flex items-center justify-center font-bold text-lg active:scale-95 transition-all"
      ></div>
    </div>
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

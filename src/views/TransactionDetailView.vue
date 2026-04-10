<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { categoryIcons } from '@/constants/categoryIcons';

const router = useRouter();
const route = useRoute();

// 1. 상태 데이터 관리
const transaction = reactive({
  id: null,
  type: 'expense', // 'expense' 또는 'income'
  amount: 9000,
  date: '2026-04-06',
  time: '13:13',
  location: '버거킹 성남이마트점',
  category: '식비',
  memo: '통새우와퍼',
  isIncluded: false, // 통계 포함 여부 (false면 '제외' 토글이 꺼진 상태)
});

const isLoaded = ref(false);
const isCategoryMenuOpen = ref(false);

// 2. 카테고리 한글명 -> 아이콘 키 매핑
const categoryMap = {
  식비: 'food',
  교통: 'transportation',
  쇼핑: 'shopping',
  생활: 'fixed',
  취미: 'entertainment',
  교육: 'education',
  의료: 'healthcare',
  기타: 'others',
  급여: 'salary',
  용돈: 'allowance',
  기타수입: 'extra',
};

// 현재 카테고리에 맞는 SVG 아이콘 가져오기
const currentIcon = computed(() => {
  const key = categoryMap[transaction.category] || 'others';
  return categoryIcons[key];
});

// 3. 타입에 따른 라벨 변경 (지출처 vs 수입처)
const locationLabel = computed(() =>
  transaction.type === 'expense' ? '지출처' : '수입처',
);

// 4. 금액 포맷팅 및 입력 핸들러
const formattedAmount = computed(() => {
  if (transaction.amount === null) return '';
  const prefix = transaction.type === 'expense' ? '-' : '+';
  return `${prefix}${transaction.amount.toLocaleString()}원`;
});

const handleAmountInput = (e) => {
  // 숫자 이외의 문자 제거 후 숫자로 저장
  const rawValue = e.target.value.replace(/[^0-9]/g, '');
  transaction.amount = rawValue ? parseInt(rawValue, 10) : null;
};

// 5. 카테고리 선택 (작성 화면과 동일 로직)
const categories = computed(() =>
  transaction.type === 'income'
    ? ['용돈', '급여', '기타수입']
    : ['카페', '식비', '교통', '쇼핑', '생활', '취미'],
);

const selectCategory = (cat) => {
  transaction.category = cat;
  isCategoryMenuOpen.value = false;
};

onMounted(() => {
  // 실제로는 route.params.id를 이용해 데이터를 가져옵니다.
  isLoaded.value = true;
});

const goBack = () => router.back();
const handleDelete = () => {
  if (confirm('정말 삭제하시겠습니까?')) router.push('/transactions');
};
</script>

<template>
  <div v-if="isLoaded" class="min-h-screen bg-white font-['Pretendard'] pb-20">
    <header class="flex items-center justify-between px-5 py-4">
      <button @click="goBack" class="p-1 active:opacity-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          class="w-6 h-6 text-slate-900"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <h1 class="text-[17px] font-bold text-slate-900">상세 내역</h1>
      <button
        @click="handleDelete"
        class="text-[15px] font-bold text-red-500 active:opacity-50"
      >
        삭제하기
      </button>
    </header>

    <section
      class="px-7 py-10 flex flex-col items-start border-b border-gray-50"
    >
      <div class="flex items-center gap-3 mb-4">
        <div
          class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center p-2 shadow-sm border border-gray-100"
        >
          <img
            :src="currentIcon"
            class="w-full h-full object-contain"
            alt="category icon"
          />
        </div>
        <span class="text-lg font-bold text-slate-500 py-1">
          {{ transaction.location }}
        </span>
      </div>

      <div class="flex items-center w-full">
        <input
          type="text"
          :value="formattedAmount"
          @input="handleAmountInput"
          class="text-4xl font-medium text-slate-900 outline-none bg-transparent w-full border-b-2 border-transparent focus:border-slate-900 transition-all py-1"
          style="font-family: 'Pretendard Medium', sans-serif"
        />
      </div>
    </section>

    <main class="p-7 space-y-10">
      <div class="flex justify-between items-center">
        <span class="text-gray-400 font-medium">날짜</span>
        <input
          v-model="transaction.date"
          type="date"
          class="text-right font-bold text-slate-900 outline-none bg-transparent appearance-none border-b-2 border-transparent focus:border-slate-900 transition-all"
        />
      </div>

      <div class="flex justify-between items-center">
        <span class="text-gray-400 font-medium">카테고리</span>
        <button
          @click="isCategoryMenuOpen = true"
          class="flex items-center gap-1 group"
        >
          <span class="text-blue-500 font-bold group-hover:underline">
            {{ transaction.category }}
          </span>
          <span class="text-[10px] text-blue-300 font-black">〉</span>
        </button>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-gray-400 font-medium">{{ locationLabel }}</span>
        <input
          v-model="transaction.location"
          type="text"
          class="text-right font-bold text-slate-900 outline-none bg-transparent flex-1 ml-10 border-b-2 border-transparent focus:border-slate-900 transition-all"
        />
      </div>

      <div class="space-y-3">
        <span
          class="text-gray-400 font-medium block border-b-2 border-transparent"
          >메모</span
        >
        <textarea
          v-model="transaction.memo"
          rows="3"
          placeholder="메모를 입력하세요"
          class="w-full text-slate-900 font-bold outline-none bg-gray-50 rounded-2xl p-4 text-sm border-2 border-transparent focus:border-slate-900 transition-all resize-none"
        ></textarea>
      </div>

      <div
        class="flex justify-between items-center pt-4 border-t border-gray-100"
      >
        <div class="flex flex-col text-left">
          <span class="text-slate-900 font-bold">통계에서 제외</span>
          <span class="text-[10px] text-gray-300 font-medium"
            >이 내역을 지출 합계와 통계에서 뺍니다.</span
          >
        </div>
        <button
          @click="transaction.isIncluded = !transaction.isIncluded"
          :class="!transaction.isIncluded ? 'bg-yellow-400' : 'bg-gray-200'"
          class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none shadow-inner"
        >
          <span
            :class="!transaction.isIncluded ? 'translate-x-6' : 'translate-x-1'"
            class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-md"
          ></span>
        </button>
      </div>
    </main>

    <Transition name="slide-up">
      <div
        v-if="isCategoryMenuOpen"
        class="fixed inset-0 z-50 flex items-end justify-center"
      >
        <div
          @click="isCategoryMenuOpen = false"
          class="absolute inset-0 bg-black/30 backdrop-blur-sm"
        ></div>
        <div
          class="relative w-full max-w-md bg-white rounded-t-[32px] p-6 shadow-2xl pb-10"
        >
          <div class="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
          <h3 class="text-xl font-bold text-slate-800 mb-6 text-left px-1">
            카테고리 선택
          </h3>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="selectCategory(cat)"
              class="py-4 rounded-2xl text-center font-semibold transition-all active:scale-95"
              :class="
                transaction.category === cat
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'bg-gray-50 text-gray-400'
              "
            >
              {{ cat }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 입력 시 밑줄 효과를 위한 트랜지션 */
input,
textarea {
  transition: border-color 0.2s ease-in-out;
}

/* Pretendard Medium 폰트 가중치 */
.font-medium {
  font-weight: 500;
}

/* 슬라이드 애니메이션 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>

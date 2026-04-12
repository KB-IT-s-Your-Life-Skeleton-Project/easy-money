<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { categoryIcons } from '@/constants/categoryIcons';
import { getCategoryLabel, normalizeCategoryKey } from '@/constants/categoryMeta';
import { useMonthlyTransactionStore } from '@/stores/monthlyTranscationStore';
import {
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from '@/apis/transactionApi';

const router = useRouter();
const route = useRoute();
const monthlyTransactionStore = useMonthlyTransactionStore();
const transactionId = String(route.params.id);

const transaction = reactive({
  id: null,
  type: 'expense',
  amount: null,
  date: '',
  content: '',
  category: '',
  memo: '',
  isIncluded: true,
});

const isLoaded = ref(false);
const isCategoryMenuOpen = ref(false);
const isSaving = ref(false);

const expenseCategories = [
  'fixed',
  'food',
  'shopping',
  'entertainment',
  'healthcare',
  'transportation',
  'education',
  'others',
];
const incomeCategories = ['salary', 'allowance', 'extra'];

const currentIcon = computed(() => {
  const key = normalizeCategoryKey(transaction.category);
  return categoryIcons[key] ?? categoryIcons.others;
});

const locationLabel = computed(() =>
  transaction.type === 'expense' ? '지출처' : '수입처',
);

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

const categories = computed(() =>
  transaction.type === 'income' ? incomeCategories : expenseCategories,
);

const selectCategory = (cat) => {
  transaction.category = cat;
  isCategoryMenuOpen.value = false;
};

const setTransactionType = (type) => {
  if (transaction.type === type) return;

  transaction.type = type;
  transaction.category = '';
  isCategoryMenuOpen.value = false;
};

const applyTransaction = (source) => {
  if (!source) return;

  transaction.id = source.id;
  transaction.type = source.type ?? 'expense';
  transaction.amount = Number(source.amount ?? 0);
  transaction.date = source.date ?? '';
  transaction.content = source.content ?? '';
  transaction.category = normalizeCategoryKey(source.category);
  transaction.memo = source.memo ?? '';
  transaction.isIncluded = source.isIncluded ?? true;
};

const loadTransaction = async () => {
  try {
    const data = await getTransactionById(transactionId);
    if (!data) {
      alert('거래 내역을 찾을 수 없습니다.');
      router.replace('/transactions');
      return;
    }

    applyTransaction(data);
    isLoaded.value = true;
  } catch (err) {
    alert('거래 내역을 찾을 수 없습니다.');
    router.replace('/transactions');
  }
};

onMounted(loadTransaction);

const goBack = () => router.back();

const handleSave = async () => {
  if (!transaction.amount || !transaction.content) {
    alert('금액과 내용을 입력해 주세요.');
    return;
  }

  if (!transaction.category) {
    alert('카테고리를 선택해 주세요.');
    return;
  }

  isSaving.value = true;

  try {
    const updated = await updateTransaction(transaction.id, {
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date,
      content: transaction.content,
      category: transaction.category,
      memo: transaction.memo,
      isIncluded: transaction.isIncluded,
    });
    if (updated) {
      monthlyTransactionStore.syncTransaction(updated);
    }
    alert('거래 내역이 수정되었습니다.');
    router.push('/transactions');
  } catch (err) {
    alert(err.message || '거래 수정에 실패했습니다.');
  } finally {
    isSaving.value = false;
  }
};

const handleDelete = async () => {
  if (!transaction.id || !confirm('정말 삭제하시겠습니까?')) return;

  try {
    await deleteTransaction(transaction.id);
    monthlyTransactionStore.removeTransactionFromState(transaction.id);
    alert('거래 내역이 삭제되었습니다.');
    router.push('/transactions');
  } catch (err) {
    alert(err.message || '거래 삭제에 실패했습니다.');
  }
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
          {{ transaction.content }}
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
            {{ getCategoryLabel(transaction.category) }}
          </span>
          <span class="text-[10px] text-blue-300 font-black">〉</span>
        </button>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-gray-400 font-medium">유형</span>
        <div class="flex items-center gap-2">
          <button
            @click="setTransactionType('income')"
            class="rounded-full px-3 py-1 text-sm font-bold transition-colors"
            :class="
              transaction.type === 'income'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-400'
            "
          >
            수입
          </button>
          <button
            @click="setTransactionType('expense')"
            class="rounded-full px-3 py-1 text-sm font-bold transition-colors"
            :class="
              transaction.type === 'expense'
                ? 'bg-red-100 text-red-500'
                : 'bg-gray-100 text-gray-400'
            "
          >
            지출
          </button>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-gray-400 font-medium">{{ locationLabel }}</span>
        <input
          v-model="transaction.content"
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
              {{ getCategoryLabel(cat) }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <div class="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 p-4">
      <button
        @click="handleSave"
        :disabled="isSaving"
        class="w-full rounded-2xl bg-slate-900 py-4 text-white font-bold disabled:opacity-50"
      >
        {{ isSaving ? '저장 중...' : '수정하기' }}
      </button>
    </div>
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

<script setup>
import { ref, reactive, computed } from 'vue'; // ref 추가
import { useTransactionStore } from '@/stores/transactionStore'; // 예시 이름
import CommonButton from '@/components/common/CommonButton.vue';

// 1. 데이터 상태 정의
const transaction = reactive({
  type: 'expense',
  date: new Date().toISOString().substring(0, 10),
  amount: null, // 실제 숫자 데이터로 저장
  content: '',
  category: '',
  memo: '',
  isIncluded: true, // ★ 기본값은 통계에 포함(true) ★
});

// 2. 금액 포맷팅 (화면 표시용)
const formattedAmount = computed(() => {
  if (!transaction.amount && transaction.amount !== 0) return '';
  return transaction.amount.toLocaleString() + '원';
});

// 3. 금액 입력 핸들러 (숫자만 추출)
const handleAmountInput = (e) => {
  // 숫자 이외의 문자 제거
  const rawValue = e.target.value.replace(/[^0-9]/g, '');
  // 숫자로 변환하여 저장
  transaction.amount = rawValue ? parseInt(rawValue, 10) : null;
};

// 4. 타입별 카테고리 자동 변경
const currentCategories = computed(() => {
  return transaction.type === 'income'
    ? ['용돈', '월급', '기타 수입', '이자']
    : ['카페', '식비', '교통', '쇼핑', '생활', '취미'];
});

// 5. 저장 함수

const store = useTransactionStore();
const submitTransaction = () => {
  if (!transaction.amount || !transaction.content) {
    alert('금액과 내용을 입력해 주세요! 👵');
    return;
  }
  // 스토어의 액션(함수)을 호출하며 데이터를 던져줍니다.
  store.addTransaction({ ...transaction });
};

const isCategoryMenuOpen = ref(false); // 메뉴 열림 상태

// 카테고리 선택 함수
const selectCategory = (cat) => {
  transaction.category = cat;
  isCategoryMenuOpen.value = false; // 선택하면 자동으로 닫힘
};
</script>

<template>
  <div class="min-h-screen bg-white pb-20 font-sans text-slate-900">
    <header class="flex items-center px-4 py-4">
      <button
        @click="$router.back()"
        class="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <h1 class="text-xl font-bold ml-2">가계부 작성</h1>
    </header>

    <main class="px-6 space-y-8 mt-4">
      <div class="relative flex bg-gray-100 rounded-xl p-1 w-full h-12">
        <div
          class="absolute top-1 left-1 h-10 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-transform duration-300 ease-in-out"
          :class="
            transaction.type === 'expense'
              ? 'translate-x-full'
              : 'translate-x-0'
          "
        ></div>

        <button
          @click="transaction.type = 'income'"
          class="relative z-10 flex-1 flex items-center justify-center font-bold transition-colors duration-300"
          :class="
            transaction.type === 'income' ? 'text-green-600' : 'text-gray-400'
          "
        >
          수입
        </button>

        <button
          @click="transaction.type = 'expense'"
          class="relative z-10 flex-1 flex items-center justify-center font-bold transition-colors duration-300"
          :class="
            transaction.type === 'expense' ? 'text-red-500' : 'text-gray-400'
          "
        >
          지출
        </button>
      </div>

      <div class="space-y-6">
        <div class="space-y-1">
          <label class="text-sm font-semibold text-gray-500">날짜</label>
          <div class="relative border-b-2 border-yellow-400 py-2">
            <input
              type="date"
              v-model="transaction.date"
              class="w-full focus:outline-none bg-transparent appearance-none text-lg"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-sm font-semibold text-gray-500">금액</label>
          <div
            class="flex items-center border-b-2 border-gray-200 focus-within:border-yellow-400 py-2 transition-colors"
          >
            <input
              type="text"
              placeholder="0원"
              :value="formattedAmount"
              @input="handleAmountInput"
              class="w-full text-2xl font-bold focus:outline-none placeholder:text-gray-300"
            />
            <button
              v-if="transaction.amount"
              @click="transaction.amount = null"
              class="text-gray-300 hover:text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-sm font-semibold text-gray-500">
            {{ transaction.type === 'income' ? '수입처' : '지출처' }}
          </label>
          <div
            class="flex items-center border-b-2 border-gray-200 focus-within:border-yellow-400 py-2 transition-colors"
          >
            <input
              type="text"
              :placeholder="
                transaction.type === 'income'
                  ? '수입처를 입력하세요.'
                  : '지출처를 입력하세요.'
              "
              v-model="transaction.content"
              class="w-full text-lg focus:outline-none placeholder:text-gray-300"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-sm font-semibold text-gray-500">카테고리</label>
          <div
            @click="isCategoryMenuOpen = true"
            class="flex items-center justify-between border-b-2 border-gray-200 focus-within:border-yellow-400 py-3 cursor-pointer"
          >
            <span
              :class="
                transaction.category
                  ? 'text-black text-lg'
                  : 'text-gray-300 text-lg'
              "
            >
              {{ transaction.category || '카테고리를 선택해 주세요' }}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-5 h-5 text-gray-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </div>

        <Transition name="slide-up">
          <div
            v-if="isCategoryMenuOpen"
            class="fixed inset-0 z-50 flex items-end justify-center"
          >
            <div
              @click="isCategoryMenuOpen = false"
              class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            ></div>

            <div
              class="relative w-full max-w-md bg-white rounded-t-[32px] p-6 shadow-2xl pb-10"
            >
              <div
                class="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"
              ></div>

              <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-slate-800">카테고리 선택</h3>
                <button
                  @click="isCategoryMenuOpen = false"
                  class="text-gray-400 p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="cat in currentCategories"
                  :key="cat"
                  @click="selectCategory(cat)"
                  class="py-4 rounded-2xl text-center font-semibold transition-all active:scale-95"
                  :class="
                    transaction.category === cat
                      ? 'bg-yellow-400 text-black shadow-md'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  "
                >
                  {{ cat }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
        <div class="space-y-1 pb-4">
          <label class="text-sm font-semibold text-gray-500">메모</label>
          <textarea
            v-model="transaction.memo"
            rows="4"
            placeholder="추가적인 내용을 적어주세요"
            class="w-full p-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
          ></textarea>
        </div>
        <div
          class="flex items-center justify-between py-4 border-t border-gray-100"
        >
          <div>
            <span class="font-semibold text-slate-700">통계에서 제외</span>
            <p class="text-xs text-gray-400">
              이 내역을 지출 합계와 통계에서 뺍니다.
            </p>
          </div>

          <button
            @click="transaction.isIncluded = !transaction.isIncluded"
            :class="!transaction.isIncluded ? 'bg-yellow-400' : 'bg-gray-200'"
            class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none"
          >
            <span
              :class="
                !transaction.isIncluded ? 'translate-x-6' : 'translate-x-1'
              "
              class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out"
            >
            </span>
          </button>
        </div>
      </div>
    </main>

    <div
      class="fixed bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-center"
    >
      <CommonButton text="저장하기" @click="submitTransaction" />
    </div>
  </div>
</template>

<style scoped>
/* input date의 기본 아이콘 색상 등 조절이 필요할 경우 여기에 작성 */
/* 아래에서 위로 올라오는 애니메이션 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.32, 0.72, 0, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%); /* 아래에 숨어있다가 */
}

.slide-up-enter-to,
.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0); /* 자기 자리로 올라옴 */
}
</style>

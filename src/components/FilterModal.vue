<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  modelValue: Boolean,
  period: { type: String, default: "1개월" },
  type: { type: String, default: "전체" },
});

const emit = defineEmits(["update:modelValue", "submit"]);

const periods = [
  { key: "1week", label: "1주일" },
  { key: "1month", label: "1개월" },
  { key: "3month", label: "3개월" },
  { key: "monthly", label: "월별" },
  { key: "custom", label: "직접설정" },
];

const types = [
  { key: "all", label: "전체" },
  { key: "income", label: "수입" },
  { key: "expense", label: "지출" },
];

const expenseCategories = [
  { key: "all", label: "전체" },
  { key: "fixed", label: "고정 지출" },
  { key: "food", label: "식비" },
  { key: "shopping", label: "쇼핑" },
  { key: "entertainment", label: "문화 생활" },
  { key: "healthcare", label: "의료·건강" },
  { key: "transportation", label: "교통" },
  { key: "education", label: "교육" },
  { key: "others", label: "기타" },
];

const incomeCategories = [
  { key: "all", label: "전체" },
  { key: "salary", label: "급여" },
  { key: "allowance", label: "용돈" },
  { key: "extra", label: "기타 수입" },
];

const now = new Date();
const selectedPeriod = ref("1month");
const selectedType = ref("all");
const selectedCategories = ref([]);
const startDate = ref("");
const endDate = ref("");
const selectedYear = ref(now.getFullYear());
const selectedMonth = ref(now.getMonth() + 1);

const periodKeysByLabel = {
  "1주일": "1week",
  "1개월": "1month",
  "3개월": "3month",
  월별: "monthly",
  직접설정: "custom",
};

const typeKeysByLabel = {
  전체: "all",
  입금: "income",
  출금: "expense",
  수입: "income",
  지출: "expense",
};

const yearOptions = computed(() =>
  Array.from({ length: 5 }, (_, i) => now.getFullYear() - i),
);

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) return;
    selectedPeriod.value = periodKeysByLabel[props.period] ?? "1month";
    onTypeChange(typeKeysByLabel[props.type] ?? "all");
  },
  { immediate: true },
);

const onTypeChange = (type) => {
  selectedType.value = type;
  selectedCategories.value = [];
};

const getCurrentCategories = () => {
  if (selectedType.value === "expense") {
    return expenseCategories.filter((category) => category.key !== "all");
  }
  if (selectedType.value === "income") {
    return incomeCategories.filter((category) => category.key !== "all");
  }
  return [];
};

const areAllCategoriesSelected = computed(() => {
  const currentCategories = getCurrentCategories();
  return (
    currentCategories.length > 0 &&
    currentCategories.every((category) =>
      selectedCategories.value.includes(category.key),
    )
  );
});

const selectCategory = (categoryKey) => {
  const currentCategoryKeys = getCurrentCategories().map(
    (category) => category.key,
  );

  if (categoryKey === "all") {
    selectedCategories.value = areAllCategoriesSelected.value
      ? []
      : [...currentCategoryKeys];
    return;
  }

  if (selectedCategories.value.includes(categoryKey)) {
    selectedCategories.value = selectedCategories.value.filter(
      (key) => key !== categoryKey,
    );
    return;
  }

  selectedCategories.value = [...selectedCategories.value, categoryKey];
};

const isCategoryActive = (categoryKey) => {
  if (categoryKey === "all") return areAllCategoriesSelected.value;
  return selectedCategories.value.includes(categoryKey);
};

const close = () => emit("update:modelValue", false);

const submit = () => {
  emit("submit", {
    period: selectedPeriod.value,
    startDate: startDate.value,
    endDate: endDate.value,
    year: selectedYear.value,
    month: selectedMonth.value,
    type: selectedType.value,
    category: selectedCategories.value,
  });
  close();
};
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="modelValue" class="overlay" @click.self="close">
        <Transition name="modal">
          <div v-if="modelValue" class="modal">
            <!-- Header -->
            <div class="modal-header">
              <h2 class="modal-title">조회 조건 설정</h2>
              <button class="close-btn" @click="close">✕</button>
            </div>

            <!-- 조회기간 -->
            <section class="section">
              <h3 class="section-title">조회기간</h3>
              <div class="period-btns">
                <button
                  v-for="p in periods"
                  :key="p.key"
                  class="period-btn"
                  :class="{ active: selectedPeriod === p.key }"
                  @click="selectedPeriod = p.key"
                >
                  {{ p.label }}
                </button>
              </div>
              <!-- 월별: 년/월 선택 -->
              <div v-if="selectedPeriod === 'monthly'" class="monthly-select">
                <select v-model="selectedYear" class="select-input">
                  <option v-for="y in yearOptions" :key="y" :value="y">
                    {{ y }}년
                  </option>
                </select>
                <select v-model="selectedMonth" class="select-input">
                  <option v-for="m in 12" :key="m" :value="m">{{ m }}월</option>
                </select>
              </div>

              <!-- 직접설정: 시작일 ~ 종료일 -->
              <div v-else-if="selectedPeriod === 'custom'" class="date-range">
                <input type="date" v-model="startDate" class="date-input" />
                <span class="date-sep">~</span>
                <input type="date" v-model="endDate" class="date-input" />
              </div>

              <!-- 1주일, 1개월, 3개월: 날짜 입력 없음 -->
            </section>

            <div class="divider" />

            <!-- 유형 -->
            <section class="section">
              <h3 class="section-title">유형</h3>
              <div class="type-btns">
                <button
                  v-for="t in types"
                  :key="t.key"
                  class="type-btn"
                  :class="{ active: selectedType === t.key }"
                  @click="onTypeChange(t.key)"
                >
                  {{ t.label }}
                </button>
              </div>
            </section>

            <div class="divider" />

            <!-- 카테고리 -->
            <section class="section">
              <h3 class="section-title">카테고리</h3>

              <!-- 지출 카테고리: 3x3 -->
              <div v-if="selectedType === 'expense'" class="category-grid">
                <button
                  v-for="c in expenseCategories"
                  :key="c.key"
                  class="category-btn"
                  :class="{ active: isCategoryActive(c.key) }"
                  @click="selectCategory(c.key)"
                >
                  {{ c.label }}
                </button>
              </div>

              <!-- 수입 카테고리: 1줄 4개 -->
              <div v-else-if="selectedType === 'income'" class="category-row">
                <button
                  v-for="c in incomeCategories"
                  :key="c.key"
                  class="category-btn"
                  :class="{ active: isCategoryActive(c.key) }"
                  @click="selectCategory(c.key)"
                >
                  {{ c.label }}
                </button>
              </div>

              <!-- 전체일 때 카테고리 없음 -->
              <p v-else class="no-category">
                유형을 선택하면 카테고리가 표시됩니다
              </p>
            </section>

            <!-- 조회 버튼 -->
            <button class="submit-btn" @click="submit">조회</button>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
<style scoped>
.modal {
  --filter-yellow: var(--color-yellow-dark, #fcaf17);
  --filter-yellow-deep: #c88400;
  --filter-yellow-soft: #fff4cc;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 20px 20px 0 0;
  width: 100%;
  max-width: 480px;
  padding: 28px 20px 32px;
  display: flex;
  flex-direction: column;
  gap: 0;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #111;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #888;
  cursor: pointer;
  padding: 4px;
}

.section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #111;
  margin-bottom: 12px;
}

.divider {
  height: 1px;
  background: #f0f0f0;
  margin: 4px 0 20px;
}

/* 기간 버튼 */
.period-btns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 14px;
}

.period-btn {
  padding: 10px 0;
  border: 1.5px solid #d9d9d9;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  color: #000;
  cursor: pointer;
  transition: all 0.15s;
}

.period-btn.active {
  background: var(--filter-yellow-soft);
  border-color: var(--filter-yellow);
  color: #000;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(252, 175, 23, 0.18);
}

/* 월별 선택 */
.monthly-select {
  display: flex;
  gap: 8px;
  border-bottom: 1.5px solid #ddd;
  padding-bottom: 4px;
}

.select-input {
  flex: 1;
  padding: 10px 28px 10px 4px;
  border: none;
  font-size: 15px;
  color: #333;
  outline: none;
  background: transparent;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 4px center;
}

/* 날짜 범위 */
.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input {
  flex: 1;
  padding: 10px 12px;
  border: none;
  border-bottom: 1.5px solid #ddd;
  font-size: 14px;
  color: #333;
  outline: none;
  background: transparent;
}

.date-sep {
  color: #999;
  font-size: 16px;
}

/* 유형 버튼 */
.type-btns {
  display: flex;
  gap: 8px;
}

.type-btn {
  flex: 1;
  padding: 10px 0;
  border: 1.5px solid #d9d9d9;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  color: #000;
  cursor: pointer;
  transition: all 0.15s;
}

.type-btn.active {
  background: var(--filter-yellow-soft);
  border-color: var(--filter-yellow);
  color: #000;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(252, 175, 23, 0.18);
}

/* 카테고리 그리드 (지출: 3x3) */
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

/* 카테고리 한줄 (수입: 4개) */
.category-row {
  display: flex;
  gap: 8px;
}

.category-btn {
  flex: 1;
  padding: 10px 0;
  border: 1.5px solid #d9d9d9;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  color: #000;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.category-btn.active {
  background: var(--filter-yellow-soft);
  border-color: var(--filter-yellow);
  color: #000;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(252, 175, 23, 0.18);
}

.no-category {
  font-size: 13px;
  color: var(--filter-yellow-deep);
  text-align: center;
  padding: 12px 0;
}

/* 조회 버튼 */
.submit-btn {
  width: 100%;
  padding: 16px;
  background: var(--filter-yellow);
  border: 1.5px solid var(--filter-yellow);
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  color: #111;
  cursor: pointer;
  margin-top: 8px;
  box-shadow: 0 8px 18px rgba(252, 175, 23, 0.24);
  transition: opacity 0.15s, transform 0.15s;
}

.submit-btn:hover {
  opacity: 0.9;
}

.submit-btn:active {
  transform: translateY(1px);
}

/* 트랜지션 */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.25s;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: transform 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  transform: translateY(100%);
}
</style>

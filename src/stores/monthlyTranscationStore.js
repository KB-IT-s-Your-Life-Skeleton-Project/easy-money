import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '@/apis/transactionApi';
import { formatLocalYearMonth } from '@/utils/date';

export const useMonthlyTransactionStore = defineStore('transaction', () => {
  const userStore = useUserStore();
  const currentMonth = ref(formatLocalYearMonth());

  const transactions = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const userId = computed(() => {
    return userStore.loginUser?.id ?? null;
  });

  const sortLatestFirst = (items) => {
    return [...items].sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;

      return String(b.id).localeCompare(String(a.id), undefined, {
        numeric: true,
      });
    });
  };

  const shiftYearMonth = (yearMonth, delta) => {
    const [year, month] = yearMonth.split('-').map(Number);
    const date = new Date(year, month - 1 + delta, 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const getMonthRange = (yearMonth) => {
    const [year, month] = yearMonth.split('-').map(Number);
    const startDate = `${yearMonth}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${yearMonth}-${String(lastDay).padStart(2, '0')}`;

    return { startDate, endDate };
  };

  // 월 총 수입
  const monthlyIncome = computed(() => {
    return transactions.value
      .filter((item) => item.type === 'income' && item.isIncluded !== false)
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  });

  // 월 총 지출
  const monthlyExpense = computed(() => {
    return transactions.value
      .filter((item) => item.type === 'expense' && item.isIncluded !== false)
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  });

  // 월 순수익
  const monthlyNetIncome = computed(() => {
    return monthlyIncome.value - monthlyExpense.value;
  });

  // 1. 월 전체 조회
  const fetchMonthTransactions = async () => {
    loading.value = true;
    error.value = null;

    try {
      if (!userId.value) {
        transactions.value = [];
        return;
      }

      const { startDate, endDate } = getMonthRange(currentMonth.value);

      const data = await getTransactions(userId.value, {
        startDate,
        endDate,
      });

      transactions.value = Array.isArray(data) ? sortLatestFirst(data) : [];
    } catch (err) {
      error.value = err.message || '월 거래내역 조회 실패';
      console.error('fetchMonthTransactions error:', err);
    } finally {
      loading.value = false;
    }
  };

  const setCurrentMonth = async (yearMonth) => {
    currentMonth.value = yearMonth;
    await fetchMonthTransactions();
  };

  const shiftCurrentMonth = async (delta) => {
    currentMonth.value = shiftYearMonth(currentMonth.value, delta);
    await fetchMonthTransactions();
  };

  // 2. 등록
  const addTransaction = async (newTransaction) => {
    loading.value = true;
    error.value = null;

    try {
      if (!userId.value) {
        throw new Error('로그인 사용자 정보가 없습니다.');
      }

      const created = await createTransaction({
        userId: userId.value,
        ...newTransaction,
      });

      if (!created) {
        throw new Error('거래 등록 응답이 없습니다.');
      }

      if (created?.date?.startsWith(currentMonth.value)) {
        transactions.value = sortLatestFirst([created, ...transactions.value]);
      }

      return created;
    } catch (err) {
      error.value = err.message || '거래 등록 실패';
      console.error('addTransaction error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 3. 수정
  const editTransaction = async (id, newData) => {
    loading.value = true;
    error.value = null;

    try {
      const updated = await updateTransaction(id, newData);

      const index = transactions.value.findIndex(
        (item) => String(item.id) === String(id),
      );

      if (index !== -1) {
        if (updated?.date?.startsWith(currentMonth.value)) {
          transactions.value[index] = updated;
          transactions.value = sortLatestFirst(transactions.value);
        } else {
          transactions.value.splice(index, 1);
        }
      } else {
        if (updated?.date?.startsWith(currentMonth.value)) {
          transactions.value = sortLatestFirst([updated, ...transactions.value]);
        }
      }

      return updated;
    } catch (err) {
      error.value = err.message || '거래 수정 실패';
      console.error('editTransaction error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 4. 삭제
  const removeTransaction = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      await deleteTransaction(id);
      transactions.value = transactions.value.filter(
        (item) => String(item.id) !== String(id),
      );
    } catch (err) {
      error.value = err.message || '거래 삭제 실패';
      console.error('removeTransaction error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const syncTransaction = (updated) => {
    const index = transactions.value.findIndex(
      (item) => String(item.id) === String(updated.id),
    );

    if (index === -1) return;

    if (updated?.date?.startsWith(currentMonth.value)) {
      transactions.value[index] = updated;
      transactions.value = sortLatestFirst(transactions.value);
    } else {
      transactions.value.splice(index, 1);
    }
  };

  const removeTransactionFromState = (id) => {
    transactions.value = transactions.value.filter(
      (item) => String(item.id) !== String(id),
    );
  };

  return {
    userId,
    currentMonth,
    transactions,
    loading,
    error,

    // 월 합계
    monthlyIncome,
    monthlyExpense,
    monthlyNetIncome,

    fetchMonthTransactions,
    setCurrentMonth,
    shiftCurrentMonth,
    addTransaction,
    editTransaction,
    removeTransaction,
    syncTransaction,
    removeTransactionFromState,
  };
});

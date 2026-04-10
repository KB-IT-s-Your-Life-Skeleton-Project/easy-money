import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '@/apis/transactionApi';

export const useMonthlyTransactionStore = defineStore('transaction', () => {
  const userId = ref(1);
  const currentMonth = ref(new Date().toISOString().slice(0, 7));

  const transactions = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const getMonthRange = (yearMonth) => {
    const [year, month] = yearMonth.split('-').map(Number);
    const startDate = `${yearMonth}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${yearMonth}-${String(lastDay).padStart(2, '0')}`;

    return { startDate, endDate };
  };

  // 1. 월 전체 조회
  const fetchMonthTransactions = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { startDate, endDate } = getMonthRange(currentMonth.value);

      const data = await getTransactions(userId.value, {
        startDate,
        endDate,
      });

      transactions.value = Array.isArray(data) ? data : [];
    } catch (err) {
      error.value = err.message || '월 거래내역 조회 실패';
      console.error('fetchMonthTransactions error:', err);
    } finally {
      loading.value = false;
    }
  };

  // 2. 등록
  const addTransaction = async (newTransaction) => {
    loading.value = true;
    error.value = null;

    try {
      const created = await createTransaction({
        userId: userId.value,
        ...newTransaction,
      });

      if (created?.date?.startsWith(currentMonth.value)) {
        transactions.value.unshift(created);
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

      const index = transactions.value.findIndex((item) => item.id === id);

      if (index !== -1) {
        if (updated?.date?.startsWith(currentMonth.value)) {
          transactions.value[index] = updated;
        } else {
          transactions.value.splice(index, 1);
        }
      } else {
        if (updated?.date?.startsWith(currentMonth.value)) {
          transactions.value.unshift(updated);
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
      transactions.value = transactions.value.filter((item) => item.id !== id);
    } catch (err) {
      error.value = err.message || '거래 삭제 실패';
      console.error('removeTransaction error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    userId,
    currentMonth,
    transactions,
    loading,
    error,
    fetchMonthTransactions,
    addTransaction,
    editTransaction,
    removeTransaction,
  };
});

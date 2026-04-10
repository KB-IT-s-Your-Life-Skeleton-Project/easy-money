<script setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import Calendar from "@/components/Calendar.vue";
import TransactionList from "@/components/common/TransactionList.vue";
import { useTransactionStore } from "@/stores/transactionStore";

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

const selectedDate = ref("");

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

onMounted(async () => {
  await transactionStore.fetchTransactions();
  if (!selectedDate.value && transactions.value.length > 0) {
    selectedDate.value = transactions.value[0].date;
  }
});

const selectedTransactions = computed(() => {
  if (!selectedDate.value) return transactions.value;
  return transactions.value.filter((item) => item.date === selectedDate.value);
});

const totalBalance = computed(() =>
  transactions.value.reduce((sum, item) => {
    return item.type === "income" ? sum + item.amount : sum - item.amount;
  }, 0),
);

const totalIncome = computed(() =>
  transactions.value
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0),
);

const totalExpense = computed(() =>
  transactions.value
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0),
);
</script>

<template>
  <div class="min-h-screen bg-[#f5f5f5] px-4 py-5">
    <section
      class="mb-5 rounded-[28px] bg-white px-5 pt-5 pb-0 shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
    >
      <Calendar v-model="selectedDate" :items="transactions" />
    </section>

    <section
      class="rounded-[28px] bg-white py-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
    >
      <div class="px-6 pb-2 text-base font-bold text-slate-500">
        {{ formatDisplayDate(selectedDate) || "거래 내역" }}
      </div>
      <TransactionList :items="selectedTransactions" />
      <p
        v-if="selectedTransactions.length === 0"
        class="px-6 py-10 text-center text-sm text-slate-400"
      >
        선택한 날짜의 거래 내역이 없습니다.
      </p>
    </section>
  </div>
</template>

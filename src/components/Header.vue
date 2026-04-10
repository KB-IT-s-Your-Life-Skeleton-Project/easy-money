<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// TODO: api 연결 필요
const income = ref(1000000);
const expense = ref(400000);

// 날짜 바뀌어도 (0시 지나도) 년/월/일 그대로 유지됨
const now = new Date();
const currentDate = {
  day: now.getDate(),
  month: now.getMonth() + 1,
  year: now.getFullYear(),
};

const balance = computed(() => income.value - expense.value);
const isPlus = computed(() => balance.value > 0);

const goProfileEdit = () => {
  router.push('/profile-edit');
};
</script>

<template>
  <div class="dashboard-container">
    <div class="space-around margin-top">
      <span class="bold"> {{ currentDate.month }}월 내 소비</span>
      <span>
        <img
          src="/defaultProfileImage.svg"
          alt="기본이미지"
          @click="goProfileEdit"
          class="profile-img"
        />
      </span>
    </div>

    <div class="space-around">
      <div class="total">
        <span> {{ isPlus ? '+' : '' }}{{ balance.toLocaleString() }}원 </span>
      </div>
      <div>
        <div class="space-between">
          <span>수입: </span>
          <span class="income">+{{ income.toLocaleString() }}원</span>
        </div>
        <div class="space-between">
          <span>지출: </span>
          <span class="expense">-{{ expense.toLocaleString() }}원</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
div {
  margin: 5px;
}
.space-around {
  display: flex;
  justify-content: space-around;
}
.space-between {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.bold {
  font-weight: bold;
}
.total {
  font-size: 1.5em;
  color: var(--color-yellow-light);
  display: flex;
  align-items: center;
}
.income {
  color: var(--color-income);
}
.expense {
  color: var(--color-expense);
}
.margin-top {
  margin-top: 30px;
}
/* 아까 추가하기로 했던 손가락 모양 커서도 클래스로 깔끔하게 분리! */
.profile-img {
  cursor: pointer;
}
</style>

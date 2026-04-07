<script setup>
// 사용 방법:
// import CommonButton from "./components/common/CommonButton.vue";
// <CommonButton text="텍스트 입력" @click=/>
defineProps({
  text: { type: String, default: "버튼" },
});
</script>

<template>
  <button>{{ text }}</button>
</template>

<style scoped>
button {
  background-color: var(--color-yellow-dark);
  border-radius: 10px;
  border: none;
  color: white;
  width: 70%;
  height: 43px;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-self: center;
  font-size: 1em;
  cursor: pointer;
}
</style>

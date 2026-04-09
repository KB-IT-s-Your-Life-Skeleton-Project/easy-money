<script setup>
// 사용 방법:
// import CommonButton from "./components/common/CommonButton.vue";
// <CommonButton text="텍스트 입력" @click=/>
defineProps({
  text: { type: String, default: '버튼' },
});

// 클릭 이벤트를 부모 컴포넌트로 전달하기 위해 정의
defineEmits(['click']);
</script>

<template>
  <button :type="type" @click="$emit('click', $event)">
    {{ text }}
  </button>
</template>

<style scoped>
button {
  /* 배경색 */
  background-color: var(--color-yellow-dark);

  /* 테두리 및 글자 스타일 */
  border-radius: 1rem;
  border: none;
  color: rgb(0, 0, 0);
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

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
  <button
    @click="$emit('click', $event)"
    :style="{ backgroundColor: 'var(--color-yellow-dark)' }"
    class="w-full py-4 hover:brightness-95 text-white font-bold text-lg rounded-2xl shadow-lg active:scale-95 transition-all"
  >
    {{ text }}
  </button>
</template>

<style scoped>
/* 버튼 텍스트가 폰트 설정(Pretendard)을 잘 따르도록 추가 */
button {
  font-family: inherit;
  border: none;
  cursor: pointer;
}
</style>

<!-- 
<style scoped>
button {
  /* 배경색 */
  background-color: var(--color-yellow-dark);

  border-radius: 16px; /* rounded-2xl 느낌 */
  border: none;
  color: var(--color-black);
  font-weight: 700;
  font-size: 1.1rem;

  width: 100%;
  padding: 1rem 0;

  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  /* 부드러운 애니메이션 */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 0px 0px #d9a300; /* 버튼 아래쪽에 살짝 입체감 주는 진한 노란색 */

  /* 테두리 및 글자 스타일
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
  cursor: pointer; */
}

button:hover {
  background-color: var(--color-yellow-dark);
}

button:active {
  /* 클릭했을 때 버튼이 아래로 눌리는 효과 */
  transform: translateY(2px);
  box-shadow: 0 0px 0px 0px #d9a300;
  filter: brightness(0.95);
}

button:disabled {
  background-color: #e5e7eb;
  color: #9ca3af;
  box-shadow: none;
  cursor: not-allowed;
}
</style> -->

<template>
  <div class="signup-page">
    <div class="phone-frame">
      <header class="header">
        <button class="back-btn" @click="goBack">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </header>

      <h1 class="page-title">회원가입</h1>

      <div class="signup-form">
        <div class="form-group">
          <label for="name">이름</label>
          <div class="input-wrapper">
            <input
              id="name"
              v-model="name"
              type="text"
              placeholder="이름을 입력해주세요"
            />
            <button
              v-if="name"
              class="icon-btn clear-btn"
              @click="clearInput('name')"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="18"
                height="18"
              >
                <path
                  d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="form-group" :class="{ 'has-error': emailError }">
          <label for="email">아이디</label>
          <div class="input-wrapper">
            <input
              id="email"
              v-model="email"
              type="email"
              @input="validateEmail"
              placeholder="이메일을 입력해주세요"
            />
            <button
              v-if="email"
              class="icon-btn clear-btn"
              @click="clearInput('email')"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="18"
                height="18"
              >
                <path
                  d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
                />
              </svg>
            </button>
          </div>
          <p v-if="emailError" class="error-msg">{{ emailError }}</p>
        </div>

        <div class="form-group" :class="{ 'has-error': passwordError }">
          <label for="password">비밀번호</label>
          <div class="input-wrapper">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              @input="validatePassword"
              placeholder="8자 이상의 영문, 숫자를 입력하세요."
            />
            <button
              class="icon-btn toggle-btn"
              @click="togglePassword('password')"
            >
              <svg
                v-if="!showPassword"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path
                  d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path
                  d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                />
              </svg>
            </button>
          </div>
          <p v-if="passwordError" class="error-msg">{{ passwordError }}</p>
        </div>

        <div class="form-group" :class="{ 'has-error': passwordConfirmError }">
          <label for="passwordConfirm">비밀번호 확인</label>
          <div class="input-wrapper">
            <input
              id="passwordConfirm"
              v-model="passwordConfirm"
              :type="showPasswordConfirm ? 'text' : 'password'"
              @input="validatePasswordConfirm"
              placeholder="비밀번호를 다시 입력해주세요"
            />
            <button
              class="icon-btn toggle-btn"
              @click="togglePassword('passwordConfirm')"
            >
              <svg
                v-if="!showPasswordConfirm"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path
                  d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path
                  d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                />
              </svg>
            </button>
          </div>
          <p v-if="passwordConfirmError" class="error-msg">
            {{ passwordConfirmError }}
          </p>
        </div>

        <CommonButton
          class="btn btn-primary submit-btn"
          text="회원가입"
          @click="handleSignup"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CommonButton from '@/components/common/CommonButton.vue';

const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

const showPassword = ref(false);
const showPasswordConfirm = ref(false);

// 초기값은 모두 빈 문자열로 설정
const emailError = ref('');
const passwordError = ref('');
const passwordConfirmError = ref('');

// 뒤로가기
const goBack = () => {
  router.go(-1);
  console.log('뒤로가기');
};

// 입력값 지우기 (X 버튼) - 지우면 에러 메시지도 함께 초기화
const clearInput = (field) => {
  if (field === 'name') name.value = '';
  if (field === 'email') {
    email.value = '';
    emailError.value = '';
  }
};

// 비밀번호 표시 토글
const togglePassword = (field) => {
  if (field === 'password') showPassword.value = !showPassword.value;
  if (field === 'passwordConfirm')
    showPasswordConfirm.value = !showPasswordConfirm.value;
};

// 1. 이메일 유효성 검사 (입력 중 발생)
const validateEmail = () => {
  if (!email.value) {
    emailError.value = ''; // 다 지웠을 때는 에러 숨김
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    emailError.value = '이메일 형식으로 입력해주세요.';
  } else {
    emailError.value = '';
  }
};

// 2. 비밀번호 유효성 검사 (최소 8자, 영문+숫자 포함)
const validatePassword = () => {
  if (!password.value) {
    passwordError.value = '';
    return;
  }
  // 영문(대소문자 상관없음) 1개 이상, 숫자 1개 이상 포함, 8자리 이상
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
  if (!passwordRegex.test(password.value)) {
    passwordError.value = '8자 이상의 영문, 숫자를 입력하세요.';
  } else {
    passwordError.value = '';
  }

  // 비밀번호를 수정했을 때 확인창에 값이 있다면 다시 비교해줌
  if (passwordConfirm.value) {
    validatePasswordConfirm();
  }
};

// 3. 비밀번호 확인 유효성 검사 (일치 여부)
const validatePasswordConfirm = () => {
  if (!passwordConfirm.value) {
    passwordConfirmError.value = '';
    return;
  }
  if (password.value !== passwordConfirm.value) {
    passwordConfirmError.value = '비밀번호가 일치하지 않습니다.';
  } else {
    passwordConfirmError.value = '';
  }
};

// 가입 버튼 눌렀을 때 최종 검사
const handleSignup = () => {
  // 빈 칸이 있거나 기존 에러가 남아있다면 가입 진행 막기
  if (
    !name.value ||
    !email.value ||
    !password.value ||
    !passwordConfirm.value ||
    emailError.value ||
    passwordError.value ||
    passwordConfirmError.value
  ) {
    alert('입력하신 정보를 다시 확인해주세요.');
    return;
  }

  console.log('회원가입 성공!', {
    name: name.value,
    email: email.value,
    password: password.value,
  });
};
</script>

<style scoped>
.signup-page {
  min-height: 100dvh;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  overflow-x: hidden;
}

.phone-frame {
  width: 100%;
  max-width: 430px;
  min-height: 100dvh;
  background: #f5f5f5;
  padding: 20px 32px 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.back-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #111;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-title {
  margin: 0 0 40px;
  font-size: 28px;
  font-weight: 700;
  color: #111;
}

.signup-form {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.form-group {
  margin-bottom: 28px;
}

.form-group label {
  display: block;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 700;
  color: #111;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  border: none;
  border-bottom: 1px solid #d8d8d8;
  background: transparent;
  padding: 8px 36px 8px 2px;
  font-size: 18px;
  font-weight: 600;
  color: #111;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.input-wrapper input::placeholder {
  color: #cfcfcf;
  font-weight: 400;
  font-size: 16px;
}

.input-wrapper input:focus {
  border-bottom: 2px solid var(--color-yellow-dark, #efa515);
}

.icon-btn {
  position: absolute;
  right: 0;
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cfcfcf;
}

.clear-btn {
  color: #dfdfdf;
}

/* 에러 상태일 때 인풋창 빨간줄 변경 */
.form-group.has-error .input-wrapper input {
  border-bottom: 2px solid #ff4d4f;
}

.form-group.has-error .input-wrapper input:focus {
  border-bottom: 2px solid #ff4d4f; /* 포커스 시에도 빨간줄 유지 */
}

/* 에러 메시지 텍스트 스타일 */
.error-msg {
  color: #ff4d4f;
  font-size: 13px;
  margin: 8px 0 0 2px;
}

.btn {
  width: 100%;
  height: 54px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary {
  background: var(--color-yellow-dark);
  color: white;
}

.submit-btn {
  margin-top: 20px;
}
</style>

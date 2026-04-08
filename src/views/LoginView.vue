<template>
  <div class="login-page">
    <div class="phone-frame">
      <!-- 로그인 헤더 -->
      <header class="brand-section">
        <div class="logo-circle">로고</div>
        <h1 class="brand-title">Easy-Money</h1>
      </header>

      <!-- 로그인 폼 -->
      <div class="login-form">
        <div class="form-group">
          <label for="email">아이디</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="이메일을 입력하세요"
          />
        </div>

        <div class="form-group">
          <label for="password">비밀번호</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        <label class="save-id">
          <input type="checkbox" v-model="saveId" />
          <span>아이디 저장</span>
        </label>

        <CommonButton
          class="btn btn-primary"
          text="로그인"
          @click="handleLogin"
        />
        <CommonButton
          class="btn btn-secondary"
          text="회원가입"
          @click="goSignup"
        />

        <button type="button" class="text-button" @click="goFindPassword">
          비밀번호 찾기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CommonButton from '@/components/common/CommonButton.vue';

const email = ref('');
const password = ref('');
const saveId = ref(false);

const handleLogin = () => {
  console.log('로그인 시도', {
    email: email.value,
    password: password.value,
    saveId: saveId.value,
  });
};

const goSignup = () => {
  console.log('회원가입 페이지 이동');
};

const goFindPassword = () => {
  console.log('비밀번호 찾기 페이지 이동');
};
</script>

<style scoped>
.login-page {
  min-height: 100dvh;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
}

.phone-frame {
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  background: #f5f5f5;
  padding: 48px 32px 40px;
  box-sizing: border-box;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 40px;
  margin-bottom: 88px;
}

.logo-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #d9d9d9;
  color: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.brand-title {
  margin: 0;
  font-size: 42px;
  font-weight: 800;
  color: var(--color-yellow-dark);
  line-height: 1;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 28px;
}

.form-group label {
  display: block;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 700;
  color: #111;
}

.form-group input {
  width: 100%;
  border: none;
  border-bottom: 1px solid #d8d8d8;
  background: transparent;
  padding: 10px 2px 12px;
  font-size: 15px;
  color: #111;
  outline: none;
  box-sizing: border-box;
}

.form-group input::placeholder {
  color: #cfcfcf;
}

.save-id {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 6px 0 38px;
  font-size: 16px;
  color: #222;
  cursor: pointer;
}

.save-id input {
  width: 18px;
  height: 18px;
  accent-color: #efa515;
}

.btn {
  width: 100%;
  height: 54px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 16px;
}

.btn-primary {
  background: var(--color-yellow-dark);
  color: white;
}

.btn-secondary {
  background: #ecd9a0;
  color: var(--color-yellow-dark);
}

.text-button {
  margin-top: 20px;
  border: none;
  background: transparent;
  color: #222;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 430px) {
  .phone-frame {
    padding: 36px 24px 32px;
  }

  .brand-title {
    font-size: 34px;
  }

  .logo-circle {
    width: 64px;
    height: 64px;
  }
}
</style>

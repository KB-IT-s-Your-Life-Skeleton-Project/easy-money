<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore.js';
import CommonButton from '@/components/common/CommonButton.vue';

const router = useRouter();
const userStore = useUserStore();

const email = ref('');
const password = ref('');
const saveId = ref(false);

// 1. 화면이 켜질 때 로컬 스토리지에 저장된 아이디가 있는지 확인
onMounted(() => {
  const savedEmail = localStorage.getItem('savedEmail');
  if (savedEmail) {
    email.value = savedEmail; // 입력창에 이메일 채우기
    saveId.value = true; // 아이디 저장 체크박스 켜기
  }
});

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert('이메일과 비밀번호를 입력해주세요.');
    return;
  }

  // 2. 로그인 버튼을 누를 때 체크박스 상태에 따라 아이디 저장 또는 삭제
  if (saveId.value) {
    localStorage.setItem('savedEmail', email.value);
  } else {
    localStorage.removeItem('savedEmail');
  }

  await userStore.login(email.value, password.value);
};

const goSignup = () => {
  router.push('/signup');
};

const goFindPassword = () => {
  console.log('비밀번호 찾기 페이지 이동');
};
</script>

<template>
  <div class="login-page">
    <div class="phone-frame">
      <header class="brand-section">
        <img src="@/assets/logo.png" alt="Easy-Money 로고" class="logo-image" />
        <h1 class="brand-title">Easy-Money</h1>
      </header>

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

<style scoped>
.login-page {
  min-height: 100dvh;
  background: #ffffff;
  display: flex;
  justify-content: center;
}

.phone-frame {
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  background: #ffffff;
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

.logo-image {
  width: 72px;
  height: 72px;
  object-fit: contain;
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
  color: white;
}

.text-button {
  margin-top: 20px;
  border: none;
  background: transparent;
  color: #222;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

@media (max-width: 430px) {
  .phone-frame {
    padding: 36px 24px 32px;
  }

  .brand-title {
    font-size: 34px;
  }

  .logo-image {
    width: 64px;
    height: 64px;
  }
}
</style>

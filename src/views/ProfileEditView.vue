<template>
  <div class="profile-edit-page">
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

      <h1 class="page-title">프로필 수정</h1>

      <div class="profile-section">
        <div class="name-edit-wrapper">
          <template v-if="isEditingName">
            <input
              ref="nameInput"
              v-model="tempName"
              class="name-input"
              @keyup.enter="saveName"
              @blur="saveName"
            />
            <button class="edit-icon-btn save-btn" @click="saveName">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2ecc71"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          </template>

          <template v-else>
            <span class="user-name">{{ userName }}</span>
            <button class="edit-icon-btn" @click="toggleEditName">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d8d8d8"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 20h9"></path>
                <path
                  d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                ></path>
              </svg>
            </button>
          </template>
        </div>
      </div>

      <div class="edit-form">
        <div class="form-group">
          <label for="currentPassword">현재 비밀번호</label>
          <div class="input-wrapper">
            <input
              id="currentPassword"
              v-model="currentPassword"
              type="password"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="newPassword">새 비밀번호</label>
          <div class="input-wrapper">
            <input id="newPassword" v-model="newPassword" type="password" />
          </div>
        </div>

        <CommonButton
          class="btn btn-primary submit-btn"
          text="비밀번호 변경"
          @click="changePassword"
        />
      </div>

      <div class="footer-links">
        <button class="text-link" @click="logout">로그아웃</button>
        <button class="text-link text-danger" @click="withdraw">
          회원 탈퇴
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import CommonButton from '@/components/common/CommonButton.vue';

const userName = ref('홍길동');
const tempName = ref(''); // 수정을 위한 임시 상태
const isEditingName = ref(false);
const nameInput = ref(null);

const currentPassword = ref('');
const newPassword = ref('');

const goBack = () => {
  console.log('뒤로가기');
};

// 이름 수정 모드 진입
const toggleEditName = async () => {
  tempName.value = userName.value;
  isEditingName.value = true;

  // DOM 업데이트 후 인풋에 포커스
  await nextTick();
  nameInput.value?.focus();
};

// 이름 저장 로직
const saveName = () => {
  if (!isEditingName.value) return;

  const trimmedName = tempName.value.trim();
  if (trimmedName && trimmedName !== userName.value) {
    userName.value = trimmedName;
    console.log('이름 변경 완료:', userName.value);
    // 여기서 API 호출 등을 수행할 수 있습니다.
  }
  isEditingName.value = false;
};

const changePassword = () => {
  if (!currentPassword.value || !newPassword.value) {
    alert('비밀번호를 입력해주세요.');
    return;
  }
  console.log('비밀번호 변경 시도', {
    current: currentPassword.value,
    new: newPassword.value,
  });
};

const logout = () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    console.log('로그아웃 처리');
  }
};

const withdraw = () => {
  if (confirm('정말 탈퇴하시겠습니까?')) {
    console.log('회원 탈퇴 처리');
  }
};
</script>

<style scoped>
.name-input {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-black);
  border: none;
  border-bottom: 2px solid var(--color-yellow-dark);
  width: 150px;
  text-align: center;
  outline: none;
  background: transparent;
  padding: 0;
}

.save-btn {
  margin-left: 10px;
}

.profile-edit-page {
  min-height: 100dvh;
  background: var(--color-white);
  display: flex;
  justify-content: center;
  overflow-x: hidden;
}
.phone-frame {
  width: 100%;
  max-width: 430px;
  min-height: 100dvh;
  background: var(--color-white);
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
  color: var(--color-black);
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-title {
  margin: 0 0 40px;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-black);
}
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 100px;
}
.name-edit-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
}
.user-name {
  font-size: 24px;
  font-weight: 500;
  color: var(--color-black);
}
.edit-icon-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.edit-form {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.form-group {
  margin-bottom: 40px;
}
.form-group label {
  display: block;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-black);
}
.input-wrapper input {
  width: 100%;
  border: none;
  border-bottom: 1px solid #e0e0e0;
  background: transparent;
  padding: 8px 2px 12px;
  font-size: 18px;
  color: var(--color-black);
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.input-wrapper input:focus {
  border-bottom: 2px solid var(--color-yellow-dark);
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
  color: var(--color-white);
}
.submit-btn {
  margin-top: 10px;
}
.footer-links {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 60px;
  padding-bottom: 20px;
}
.text-link {
  background: none;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  color: var(--color-black);
  padding: 10px 20px;
}
.text-danger {
  color: var(--color-expense);
}
</style>

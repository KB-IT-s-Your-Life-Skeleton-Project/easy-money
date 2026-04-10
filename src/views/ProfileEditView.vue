<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore.js';
import CommonButton from '@/components/common/CommonButton.vue';
import { fetchUser as apiFetchUser } from '@/apis/userApi.js';

const router = useRouter();
const userStore = useUserStore();

// 1. 실제 로그인된 유저의 이름으로 초기화
const userName = ref(userStore.loginUser?.name || '');
const tempName = ref('');
const isEditingName = ref(false);
const nameInput = ref(null);

const currentPassword = ref('');
const newPassword = ref('');

const goBack = () => {
  router.back();
};

const toggleEditName = async () => {
  tempName.value = userName.value;
  isEditingName.value = true;
  await nextTick();
  nameInput.value?.focus();
};

// 2. 이름 변경 실행
const saveName = async () => {
  if (!isEditingName.value) return;

  const trimmedName = tempName.value.trim();
  if (trimmedName && trimmedName !== userName.value) {
    // Store를 통해 DB 업데이트 요청
    const isSuccess = await userStore.updateProfile({ name: trimmedName });

    if (isSuccess) {
      userName.value = trimmedName; // 화면에 보이는 이름도 변경
      alert('이름이 성공적으로 변경되었습니다.');
    } else {
      alert('이름 변경에 실패했습니다.');
    }
  }
  isEditingName.value = false;
};

// 3. 비밀번호 변경 실행
const changePassword = async () => {
  if (!currentPassword.value || !newPassword.value) {
    alert('현재 비밀번호와 새 비밀번호를 모두 입력해주세요.');
    return;
  }

  // 현재 비밀번호가 맞는지 DB 데이터와 비교
  const currentUserInfo = await apiFetchUser(userStore.loginUser.id);
  if (currentUserInfo.password !== currentPassword.value) {
    alert('현재 비밀번호가 일치하지 않습니다.');
    return;
  }

  // Store를 통해 새 비밀번호로 업데이트 요청
  const isSuccess = await userStore.updateProfile({
    password: newPassword.value,
  });

  if (isSuccess) {
    alert('비밀번호가 성공적으로 변경되었습니다.');

    currentPassword.value = '';
    newPassword.value = '';
  } else {
    alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
  }
};

const logout = () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    userStore.logout();
  }
};

// 4. 회원 탈퇴 실행
const withdraw = () => {
  if (confirm('정말 탈퇴하시겠습니까? (이 작업은 되돌릴 수 없습니다)')) {
    userStore.withdrawAccount();
  }
};
</script>

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

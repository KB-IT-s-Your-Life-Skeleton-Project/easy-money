// stores/userStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/apis/index.js';
import {
  login as apiLogin,
  signin as apiSignin,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
} from '@/apis/userApi';

export const useUserStore = defineStore(
  'user',
  () => {
    const router = useRouter();

    // --- State ---
    const loginUser = ref(null);

    // --- Getters ---
    // loginUser에 값이 들어오면 자동으로 true가 됨
    const isLogin = computed(() => loginUser.value !== null);

    // --- Actions ---

    // 1. 로그인
    const login = async (email, password) => {
      try {
        const user = await apiLogin({ email, password });

        if (user) {
          loginUser.value = {
            id: user.id,
            name: user.name,
            email: user.email,
          };
          router.push('/calendar');
          return user; // 성공 시 유저 정보 반환
        } else {
          alert('이메일 또는 비밀번호가 올바르지 않습니다.');
          return null;
        }
      } catch (error) {
        console.error('로그인 중 에러:', error);
        return null;
      }
    };

    // 2. 로그아웃
    const logout = () => {
      loginUser.value = null;
      alert('로그아웃 되었습니다.');
      router.push('/login');
    };

    // 3. 회원가입 (자동 로그인 로직 추가)
    const signup = async (userData) => {
      try {
        // 1) 이메일 중복 체크
        const checkResponse = await api.get('/users', {
          params: { email: userData.email },
        });

        if (checkResponse.data.length > 0) {
          alert('이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.');
          return;
        }

        // 2) 회원가입 API 호출
        await apiSignin(userData, async () => {
          alert('회원가입이 완료되었습니다!');

          // 3) 가입 정보로 바로 로그인 시도
          const loggedInUser = await login(userData.email, userData.password);

          if (loggedInUser) {
            // 로그인까지 성공하면 메인으로 이동
            router.push('/calendar');
          } else {
            // 가입은 됐는데 로그인이 실패한 경우 (드문 케이스)
            alert('자동 로그인에 실패했습니다. 로그인 페이지로 이동합니다.');
            router.push('/login');
          }
        });
      } catch (error) {
        console.error('회원가입 처리 중 에러:', error);
        alert('회원가입 중 오류가 발생했습니다.');
      }
    };

    // 4. 프로필 정보 수정 (이름, 비밀번호 등)
    const updateProfile = async (newData) => {
      if (!loginUser.value) return false;

      try {
        // API 호출 (현재 로그인된 유저 ID와 변경할 데이터 전달)
        const updatedUser = await apiUpdateUser(loginUser.value.id, newData);

        if (updatedUser) {
          // 스토어의 정보도 최신화 (이름이 바뀌었을 수 있으므로)
          loginUser.value = {
            ...loginUser.value,
            ...newData,
          };
          return true; // 성공 시 true 반환
        }
      } catch (error) {
        console.error('정보 수정 실패:', error);
        return false;
      }
    };

    // 5. 회원 탈퇴
    const withdrawAccount = async () => {
      if (!loginUser.value) return;

      try {
        await apiDeleteUser(loginUser.value.id); // DB에서 삭제
        alert('회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.');
        loginUser.value = null; // 로그인 정보 초기화
        router.push('/login');
      } catch (error) {
        console.error('회원 탈퇴 실패:', error);
        alert('회원 탈퇴 처리 중 문제가 발생했습니다.');
      }
    };

    return {
      loginUser,
      isLogin,
      login,
      logout,
      signup,
      updateProfile,
      withdrawAccount,
    };
  },
  {
    persist: true,
  }
);

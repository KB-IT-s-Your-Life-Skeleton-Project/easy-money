// stores/user.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { login as apiLogin, signin as apiSignin } from '@/apis/userApi';

export const useUserStore = defineStore('user', () => {
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
        // 로그인 성공 시 메시지 (단, 회원가입 시에는 생략하고 싶다면 파라미터로 조절 가능)
        return user; // 성공 시 유저 정보 반환
      } else {
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
    router.push('/');
  };

  // 3. 회원가입 (자동 로그인 로직 추가)
  const signup = async (userData) => {
    try {
      // 1) 이메일 중복 체크
      const checkResponse = await axios.get(
        `/api/users?email=${userData.email}`
      );

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
          router.push('/');
        } else {
          // 가입은 됐는데 로그인이 실패한 경우 (드문 케이스)
          alert('자동 로그인에 실패했습니다. 로그인 페이지로 이동합니다.');
          router.push('/');
        }
      });
    } catch (error) {
      console.error('회원가입 처리 중 에러:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return {
    loginUser,
    isLogin,
    login,
    logout,
    signup,
  };
});

import axios from "axios";

const BASE_URL = "/api/users";
/**
 *
 * 스토어에서 회원 중복 로직 작성 필요합니다.
 * @param {{ email: string, password: string, name: string }} 회원가입 정보
 * @param {Function} successCallback 회원가입 성공 시 실행할 함수(ex. 유저정보 가져오기 + 홈 화면 이동)
 * @example
 * signin({ email: "email", password: "11", name: "11" }, successSignin)
 */

export const signin = async ({ email, password, name }, successCallback) => {
  try {
    const payload = { email, password, name };
    const response = await axios.post(BASE_URL, payload);
    if (response.status === 201) {
      console.log("회원가입 성공", response.data);
      successCallback;
    }
  } catch (err) {
    alert(`signin 호출 에러: ${err.message}`);
  }
};
/**
 * @param {{ email: "email", password: "11", name: "11" }}
 * @param {Function} 로그인 성공시 실행될 함수 (ex. 메인 페이지로 이동 등)
 * @example const user = login({ email: "test@example.com", password: "test" },successLogin);
 **/
export const login = async ({ email, password }) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: { email, password },
    });
    if (response.status === 200) {
      /*
      TODO: params로 필터링된 유저가 여러명이면??(같은 이메일,비밀번호인 경우)
      1. 이메일을 고유값으로 지정해 회원가입 방지(고유값 되는지 모름)
      2. 아이디, 비밀번호 찾기 기능 있어야 함
      */

      // resopnse는 배열이므로 첫번째 유저로 로그인 되도록 설정함
      return response.data[0];
    } else {
      alert("로그인 실패");
    }
  } catch (err) {
    alert(`login 호출 에러: ${err.message}`);
  }
};
/**
 * @example const user = fetchUser(id)
 **/
export const fetchUser = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    // url/:id 로 조회하는 경우 하나의 객체 반환
    if (response.status === 200) {
      return response.data;
    } else {
      alert("데이터 조회 실패");
    }
  } catch (err) {
    alert(`fetchUser 호출 에러: ${err.message}`);
  }
};
/**
 * put은 전체 수정으로 전체 데이터 필요하나, 기존 데이터 기본세팅하여 추가 정보만 기입 가능함
 * @param {{ email?, password?, name? }} newData 변경할 사용자 정보
 * @example updateUser(id,{email:11,password:11,name:11})
 * @example updateUser(id,{email:11,password:11})
 **/
export const updateUser = async (id, newData) => {
  const user = await fetchUser(id);
  const payload = { ...user, ...newData };
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, payload);
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    } else {
      alert("업데이트 실패");
    }
  } catch (err) {
    alert(`updateUser 호출 에러: ${err.message}`);
  }
};

/**
 * @example deleteUser(id)
 **/
export const deleteUser = async (id) => {
  try {
    response = await axios.delete(`${BASE_URL}/${id}`);
    if (response.status === 200) {
      return response.data;
    } else {
      ("회원 삭제 오류");
    }
  } catch (err) {
    alert(`이미 삭제되었거나 삭제할 id가 잘못되었습니다. \n${err.message}`);
  }
};

import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', () => {
  // 1. 상태 (State): 지금 당장 화면에 보여줄 데이터 리스트
  const transactions = ref([]);
  const BASE_URL = 'http://localhost:3000/transactions'; // db.json 서버 주소

  // 2. 액션 (Actions): 데이터를 가져오고 저장하는 함수들

  // 서버에서 데이터 불러오기 (처음 앱 켤 때)
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(BASE_URL);
      transactions.value = response.data;
    } catch (error) {
      console.error('데이터 로딩 실패! 😭', error);
    }
  };

  // 새로운 내역 추가하기 (윤아님이 작성한 데이터 받기)
  const addTransaction = async (newTransaction) => {
    try {
      // (1) 먼저 서버(db.json)에 저장 요청!
      const response = await axios.post(BASE_URL, newTransaction);

      // (2) 서버 저장 성공하면 우리 앱의 공유 수첩(state)에도 추가!
      // 이렇게 해야 새로고침 안 해도 화면이 바로 바뀌어요.
      transactions.value.push(response.data);

      console.log('서버 저장 완료! ❤️');
    } catch (error) {
      console.error('저장 실패! ㅠㅠ', error);
      alert('저장에 실패했어요. 서버가 켜져 있는지 확인해 보세요!');
    }
  };

  // 밖에서 쓸 수 있게 내보내기
  return { transactions, fetchTransactions, addTransaction };
});

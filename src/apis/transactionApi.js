import axios from 'axios';

const BASE_URL = '/api/transactions';

export const createTransaction = async (data) => {
  try {
    const response = await axios.post(BASE_URL, data);
    return response.data;
  } catch (e) {
    console.log('## 저장에 오류가 발생했습니다.');
    if (e instanceof Error) console.log(e.message);
    else console.log(e);
  }
};
export const deleteTransaction = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (e) {
    console.log('삭제 중 오류가 발생하였습니다.');
    if (e instanceof Error) console.log(e.message);
    else console.log(e);
  }
};

/**
 *
 * @returns 개별 거래내역 return
 * @example const transaction = await getTransaction();
 */
export const getTransactionById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (err) {
    alert(`getTransaction 호출 에러: ${err.message}`);
  }
};

/**
 * 전체 거래, 특정 거래일, 수입/지출, 카테고리 입력으로 호출
 * 세부 쿼리는 store에서 작성
 * @param {*} options 조건 선택적으로 조회(example 참고)
 * @example
 * const all = await getTransactions({userId:1});
 * @example
 * const byDate = await getTransactions({ userId:1,date: "2026-04-01" });
 * @example
 * const byRange = await getTransactions({
 * userId:1
 * startDate: "2026-04-01",
 * endDate: "2026-04-30",
 * category: ["음식", "교통"],
 * type: "expense",
 * });
 **/

export const getTransactions = async (
  userId,
  { date, startDate, endDate, category = [], type } = {},
) => {
  if (!userId) throw new Error('userId는 필수입니다.');
  try {
    const params = {};
    const numericUserId = Number(userId);
    params.userId = Number.isNaN(numericUserId) ? userId : numericUserId;
    if (date) params.date = date;
    if (startDate && endDate) {
      params['date_gte'] = startDate;
      params['date_lte'] = endDate;
    }
    if (category.length) params.category_in = category;
    if (type) params.type = type;
    const response = await axios.get(BASE_URL, { params });
    if (response.status === 200) {
      return response.data.sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;

        return String(b.id).localeCompare(String(a.id), undefined, {
          numeric: true,
        });
      });
    }
  } catch (err) {
    alert(`거래내역 호출 에러: ${err.message}`);
  }
};
export const updateTransaction = async (id, newData) => {
  try {
    const transaction = await getTransactionById(id);
    const payload = { ...transaction, ...newData };
    const response = await axios.put(`${BASE_URL}/${id}`, payload);
    return response.data;
  } catch (err) {
    alert(`거래 수정 에러: ${err.message}`);
  }
};

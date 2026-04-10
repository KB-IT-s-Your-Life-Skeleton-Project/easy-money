import axios from "axios";

const BASE_URL = "/api/transactions";
/**
 *
 * @returns 개별 거래내역 return
 * @example const transaction = await getTransaction();
 */
export const getTransactionById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    } else {
      alert("거래내역 상세 조회 실패");
    }
  } catch (err) {
    alert(`getTransaction 호출 에러: ${err.message}`);
  }
};
/**
 * 전체 거래, 특정 거래일, 수입/지출, 카테고리 입력으로 호출
 * 세부 쿼리는 store에서 작성
 * @param {*} options 조건 선택적으로 조회(example 참고)
 * @example
 * const all = await getTransactions();
 * @example
 * const byDate = await getTransactions({ date: "2026-04-01" });
 * @example
 * const byRange = await getTransactions({
 * startDate: "2026-04-01",
 * endDate: "2026-04-30",
 * category: ["음식", "교통"],
 * type: "expense",
 * });
 **/

export const getTransactions = async ({
  userId,
  date,
  startDate,
  endDate,
  category = [],
  type,
} = {}) => {
  try {
    const params = {};
    if (userId) params.userId = userId;
    if (date) params.date = date;
    if (startDate && endDate) {
      params["date_gte"] = startDate;
      params["date_lte"] = endDate;
    }
    if (category.length) params.category_in = category;
    if (type) params.type = type;
    const response = await axios.get(BASE_URL, { params });
    if (response.status === 200) {
      return response.data;
    }
  } catch (err) {
    alert(`거래내역 호출 에러: ${err.message}`);
  }
};
export const updateTranscation = async () => {
  response = await axios.put();
};

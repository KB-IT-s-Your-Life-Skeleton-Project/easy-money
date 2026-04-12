import api from "@/apis/index.js";
import { normalizeCategoryKey } from "@/constants/categoryMeta";

const BASE_URL = "/transactions";
export const createTransaction = async (data) => {
  try {
    const response = await api.post(BASE_URL, data);
    return response.data;
  } catch (e) {
    console.error("## 저장에 오류가 발생했습니다.", e);
    throw new Error("거래 저장에 실패했습니다.");
  }
};
export const deleteTransaction = async (id) => {
  try {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (e) {
    console.error("삭제 중 오류가 발생하였습니다.", e);
    throw new Error("거래 삭제에 실패했습니다.");
  }
};

/**
 *
 * @returns 개별 거래내역 return
 * @example const transaction = await getTransaction();
 */
export const getTransactionById = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(`거래내역 조회에 실패했습니다: ${err.message}`);
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
  if (!userId) throw new Error("userId는 필수입니다.");

  const sortLatestFirst = (items) =>
    [...items].sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;

      return String(b.id).localeCompare(String(a.id), undefined, {
        numeric: true,
      });
    });

  try {
    const params = {};
    if (date) params.date = date;
    if (startDate && endDate) {
      params["date_gte"] = startDate;
      params["date_lte"] = endDate;
    }

    const userIdCandidates = Array.from(
      new Set(
        [userId, String(userId), Number(userId)].filter(
          (value) => value !== "" && !Number.isNaN(value),
        ),
      ),
    );

    const responses = await Promise.all(
      userIdCandidates.map((candidate) =>
        api.get(BASE_URL, { params: { ...params, userId: candidate } }),
      ),
    );

    const merged = responses.flatMap((response) =>
      Array.isArray(response.data) ? response.data : [],
    );

    const deduped = Array.from(
      new Map(merged.map((item) => [String(item.id), item])).values(),
    );

    const normalizedCategorySet = new Set(
      category.map((item) => normalizeCategoryKey(item)),
    );

    const filtered = deduped.filter((item) => {
      if (type && item.type !== type) return false;

      if (normalizedCategorySet.size > 0) {
        const itemCategory = normalizeCategoryKey(item.category);
        if (!normalizedCategorySet.has(itemCategory)) return false;
      }

      return true;
    });

    return sortLatestFirst(filtered);
  } catch (err) {
    throw new Error(`거래내역 조회에 실패했습니다: ${err.message}`);
  }
};
export const updateTransaction = async (id, newData) => {
  try {
    const transaction = await getTransactionById(id);
    const payload = { ...transaction, ...newData };
    const response = await api.put(`${BASE_URL}/${id}`, payload);
    return response.data;
  } catch (err) {
    throw new Error(`거래 수정에 실패했습니다: ${err.message}`);
  }
};

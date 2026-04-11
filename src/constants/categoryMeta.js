import { categoryColors } from '@/constants/categoryColors';

export const categoryLabels = {
  급여: '급여',
  용돈: '용돈',
  '기타 수입': '기타 수입',
  식비: '식비',
  교통: '교통',
  교육: '교육',
  '고정 지출': '고정 지출',
  쇼핑: '쇼핑',
  '의료·건강': '의료·건강',
  '문화 생활': '문화 생활',
  기타: '기타',
};

export const normalizeCategoryKey = (category) => {
  const map = {
    급여: 'salary',
    용돈: 'allowance',
    '기타 수입': 'extra',
    식비: 'food',
    교통: 'transportation',
    교육: 'education',
    '고정 지출': 'fixed',
    쇼핑: 'shopping',
    '의료·건강': 'healthcare',
    '문화 생활': 'entertainment',
    기타: 'others',
  };

  return map[category] ?? 'others';
};

export const getCategoryLabel = (category) => {
  return categoryLabels[category] ?? '기타';
};

export const getCategoryColor = (type, category) => {
  const key = normalizeCategoryKey(category);
  return categoryColors[type]?.[key] ?? categoryColors.expense.others;
};

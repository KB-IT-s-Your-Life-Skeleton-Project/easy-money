import { categoryColors } from '@/constants/categoryColors';

export const categoryLabels = {
  salary: '급여',
  allowance: '용돈',
  extra: '기타 수입',
  food: '식비',
  transportation: '교통',
  education: '교육',
  fixed: '고정 지출',
  shopping: '쇼핑',
  healthcare: '의료·건강',
  entertainment: '문화 생활',
  others: '기타',
};

export const normalizeCategoryKey = (category) => {
  const map = {
    salary: 'salary',
    allowance: 'allowance',
    extra: 'extra',
    '기타수입': 'extra',
    '부가수입': 'extra',
    food: 'food',
    transport: 'transportation',
    transportation: 'transportation',
    education: 'education',
    fixed: 'fixed',
    shopping: 'shopping',
    health: 'healthcare',
    healthcare: 'healthcare',
    culture: 'entertainment',
    entertainment: 'entertainment',
    etc: 'others',
    other: 'others',
    others: 'others',
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
  const key = normalizeCategoryKey(category);
  return categoryLabels[key] ?? '기타';
};

export const getCategoryColor = (type, category) => {
  const key = normalizeCategoryKey(category);
  return categoryColors[type]?.[key] ?? categoryColors.expense.others;
};

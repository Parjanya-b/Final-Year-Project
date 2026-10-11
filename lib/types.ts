export type TxType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TxType;
  category: string;
  amount: number;
  date: Date;
  description: string;
  isDemo: boolean;
}

export const GOAL_TYPES = [
  'Emergency Fund', 'Car', 'Home Down Payment', 'Education',
  'Wedding', 'Travel', 'Retirement', 'Gadget/Vehicle EMI',
] as const;
export type GoalType = (typeof GOAL_TYPES)[number];

export interface Goal {
  id: string;
  name: string;
  goalType: GoalType;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
}

export const EXPENSE_CATEGORIES = [
  'Food', 'Groceries', 'Transport', 'Rent', 'EMI', 'Utilities',
  'Entertainment', 'Shopping', 'Health', 'Education', 'Other',
];
export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Other'];

export const GOAL_EMOJI: Record<GoalType, string> = {
  'Emergency Fund': '🛟',
  'Car': '🚗',
  'Home Down Payment': '🏡',
  'Education': '🎓',
  'Wedding': '💍',
  'Travel': '✈️',
  'Retirement': '🌴',
  'Gadget/Vehicle EMI': '💻',
};
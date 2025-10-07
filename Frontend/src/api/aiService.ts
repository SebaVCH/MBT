import { apiClient } from './apiClient';

export interface AITipsResponse {
  tips: string;
  generated_at: string;
}

export const aiService = {
  getFinancialTips: () =>
    apiClient.get<AITipsResponse>('/person/ai-tips'),
};

'use client';

import { useState, useEffect } from 'react';
import { dashboardAPI, documentsAPI, supportAPI, salesAPI, billingAPI } from './api';
import { mockData, mockApi } from './mockData';

// Type definitions
export interface DocumentSummary {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  fileType: string;
  fileSize: number;
  status: string;
  createdAt: string;
}

export interface SupportQuery {
  id: string;
  subject: string;
  message: string;
  status: 'pending' | 'in-progress' | 'resolved';
  category?: string;
  createdAt: string;
  response?: string;
}

export interface SalesEmail {
  id: string;
  subject: string;
  content: string;
  type: string;
  status: 'draft' | 'sent' | 'scheduled';
  recipientEmail?: string;
  sentAt?: string;
  createdAt: string;
}

// Check if we're using mock data
const useMockData = () => process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Generic hook for API data fetching
function useApiData<T>(
  apiCall: () => Promise<T>,
  mockDataFallback: T,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (useMockData()) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(mockDataFallback);
      } else {
        const response = await apiCall();
        setData(response);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, isLoading, error, refetch: fetchData };
}

// Document hooks
export function useDocuments() {
  return useApiData(
    () => documentsAPI.getAll(),
    mockData.summaries
  );
}

export function useDocument(id: string) {
  return useApiData(
    () => documentsAPI.getById(id),
    mockData.summaries.find(doc => doc.id === id) || null,
    [id]
  );
}

export function useDocumentUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadDocument = async (file: File): Promise<DocumentSummary | null> => {
    setIsUploading(true);
    setError(null);

    try {
      if (useMockData()) {
        const result = await mockApi.processDocument(file);
        return result;
      } else {
        const response = await documentsAPI.upload(file);
        return response;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadDocument, isUploading, error };
}

// Support hooks
export function useSupportQueries() {
  return useApiData(
    () => supportAPI.getQueries(),
    mockData.supportQueries
  );
}

export function useSupportSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitQuery = async (query: {
    subject: string;
    message: string;
    category: string;
  }): Promise<SupportQuery | null> => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (useMockData()) {
        await mockApi.delay(2000);
        const newQuery: SupportQuery = {
          id: Date.now().toString(),
          ...query,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        return newQuery;
      } else {
        const response = await supportAPI.submitQuery(query);
        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.error || 'Submission failed');
          return null;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateResponse = async (queryId: string): Promise<string | null> => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (useMockData()) {
        const result = await mockApi.generateSupportResponse('mock query');
        return result.response;
      } else {
        const response = await supportAPI.generateSupportResponse(queryId);
        if (response.success && response.data) {
          return response.data.response;
        } else {
          setError(response.error || 'Response generation failed');
          return null;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Response generation failed');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitQuery, generateResponse, isSubmitting, error };
}

// Sales hooks
export function useSalesEmails() {
  return useApiData(
    () => salesAPI.getHistory(),
    mockData.salesEmails
  );
}

export function useSalesEmailGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateEmail = async (type: string, context: any): Promise<{
    subject: string;
    content: string;
    suggestions: string[];
  } | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      if (useMockData()) {
        const result = await mockApi.generateSalesEmail(type, context);
        return result;
      } else {
        const response = await salesAPI.generateEmail({ 
          emailType: type, 
          customerName: context.recipientName || '',
          customerCompany: context.recipientCompany || '',
          customerEmail: context.recipientEmail || '',
          industry: context.industry || '',
          painPoint: context.painPoint || '',
          productInterest: context.productService || ''
        });
        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.error || 'Email generation failed');
          return null;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email generation failed');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const sendEmail = async (data: {
    to: string;
    subject: string;
    content: string;
  }): Promise<boolean> => {
    setIsGenerating(true);
    setError(null);

    try {
      if (useMockData()) {
        await mockApi.delay(1500);
        return true;
      } else {
        const response = await salesAPI.sendEmail(data);
        if (response.success) {
          return true;
        } else {
          setError(response.error || 'Email sending failed');
          return false;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email sending failed');
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateEmail, sendEmail, isGenerating, error };
}

// Dashboard hooks
export function useDashboardStats() {
  return useApiData(
    () => dashboardAPI.getStats(),
    {
      stats: mockData.stats,
      activities: mockData.activities,
    }
  );
}

// Billing hooks
export function useCredits() {
  return useApiData(
    () => billingAPI.getInfo(),
    { credits: mockData.user.credits, transactions: [] }
  );
}

export function useBillingHistory() {
  return useApiData(
    () => billingAPI.getHistory(),
    []
  );
}

export function useCreditPurchase() {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchaseCredits = async (amount: number): Promise<string | null> => {
    setIsPurchasing(true);
    setError(null);

    try {
      if (useMockData()) {
        await mockApi.delay(2000);
        return 'https://checkout.stripe.com/mock-session';
      } else {
        const response = await billingAPI.purchaseCredits(amount);
        if (response.success && response.data) {
          return response.data.url;
        } else {
          setError(response.error || 'Purchase failed');
          return null;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed');
      return null;
    } finally {
      setIsPurchasing(false);
    }
  };

  return { purchaseCredits, isPurchasing, error };
}

// Generic mutation hook for actions that modify data
export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<{ success: boolean; data?: TData; error?: string }>,
  mockFn?: (variables: TVariables) => Promise<TData>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (variables: TVariables): Promise<TData | null> => {
    setIsLoading(true);
    setError(null);

    try {
      if (useMockData() && mockFn) {
        return await mockFn(variables);
      } else {
        const response = await mutationFn(variables);
        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.error || 'Operation failed');
          return null;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
}

export default {
  useDocuments,
  useDocument,
  useDocumentUpload,
  useSupportQueries,
  useSupportSubmission,
  useSalesEmails,
  useSalesEmailGeneration,
  useDashboardStats,
  useCredits,
  useBillingHistory,
  useCreditPurchase,
  useMutation,
};
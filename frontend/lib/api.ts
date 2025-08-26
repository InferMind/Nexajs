// API service for connecting to the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

// Helper function to make authenticated requests
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: async (userData: {
    email: string;
    password: string;
    name: string;
    company?: string;
    plan: string;
  }) => {
    return makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    return makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getProfile: async () => {
    return makeRequest('/auth/profile');
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    return makeRequest('/dashboard/stats');
  },
};

// Documents API
export const documentsAPI = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  },

  getAll: async () => {
    return makeRequest('/documents');
  },

  getById: async (id: string) => {
    return makeRequest(`/documents/${id}`);
  },

  delete: async (id: string) => {
    return makeRequest(`/documents/${id}`, {
      method: 'DELETE',
    });
  },
};

// Support API
export const supportAPI = {
  generateFAQs: async (data: { documents: string[]; category?: string }) => {
    return makeRequest('/support/generate-faqs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  submitQuery: async (query: {
    subject: string;
    message: string;
    category?: string;
  }) => {
    return makeRequest('/support/query', {
      method: 'POST',
      body: JSON.stringify(query),
    });
  },

  getQueries: async () => {
    return makeRequest('/support/queries');
  },
};

// Sales API
export const salesAPI = {
  generateEmail: async (data: {
    emailType: string;
    customerName: string;
    customerCompany: string;
    customerEmail: string;
    industry: string;
    painPoint: string;
    productInterest: string;
  }) => {
    return makeRequest('/sales/generate-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getTemplates: async () => {
    return makeRequest('/sales/templates');
  },

  getHistory: async () => {
    return makeRequest('/sales/history');
  },

  sendEmail: async (emailData: {
    to: string;
    subject: string;
    content: string;
  }) => {
    return makeRequest('/sales/send', {
      method: 'POST',
      body: JSON.stringify(emailData),
    });
  },
};

// Billing API
export const billingAPI = {
  getInfo: async () => {
    return makeRequest('/billing/info');
  },

  purchaseCredits: async (amount: number) => {
    return makeRequest('/billing/purchase', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },

  getHistory: async () => {
    return makeRequest('/billing/history');
  },
};

// Helper function to store auth token
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

// Helper function to remove auth token
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
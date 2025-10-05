import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

console.log("API_BASE_URL:", API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  console.log("API Request:", config.method?.toUpperCase(), config.url);
  console.log("API Request data:", config.data);

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    console.log("API Response data:", response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.status, error.config?.url);
    console.error("API Error data:", error.response?.data);

    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export interface User {
  _id: string;
  email: string;
  name: string;
  role: "user" | "agent" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  createdBy: User;
  assignedTo?: User;
  slaDeadline: string;
  actualResolutionTime?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  ticketId: string;
  content: string;
  author: User;
  parentComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineLog {
  _id: string;
  ticketId: string;
  action: string;
  description: string;
  userId: User;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  [key: string]: T[] | unknown;
  pagination: {
    limit: number;
    offset: number;
    total: number;
    next_offset: number | null;
  };
}

export interface ApiResponse<T> {
  [key: string]: T | unknown;
  message: string;
}

export interface ApiError {
  error: {
    code: string;
    field?: string;
    message: string;
  };
}

// Auth API
export const authApi = {
  register: async (data: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }) => {
    const response = await apiClient.post<
      ApiResponse<{ user: User; token: string }>
    >("/api/auth/register", data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    console.log(
      "API: Making login request to:",
      API_BASE_URL + "/api/auth/login"
    );
    console.log("API: Request data:", data);

    try {
      const response = await apiClient.post<
        ApiResponse<{ user: User; token: string }>
      >("/api/auth/login", data);
      console.log("API: Response received:", response);
      console.log("API: Response data:", response.data);
      console.log("API: Response data type:", typeof response.data);
      console.log("API: Response data keys:", Object.keys(response.data || {}));
      console.log("API: Full response structure:", {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
      });

      // The backend returns the data directly, not wrapped in ApiResponse
      // So we return response.data directly
      return response.data;
    } catch (error) {
      console.error("API: Request failed:", error);
      throw error;
    }
  },

  getMe: async () => {
    const response = await apiClient.get<ApiResponse<{ user: User }>>(
      "/api/auth/me"
    );
    return response.data;
  },
};

// Tickets API
export const ticketsApi = {
  createTicket: async (data: {
    title: string;
    description: string;
    priority: string;
    assignedTo?: string;
  }) => {
    const response = await apiClient.post<ApiResponse<{ ticket: Ticket }>>(
      "/api/tickets",
      data
    );
    return response.data;
  },

  getTickets: async (params?: {
    limit?: number;
    offset?: number;
    status?: string;
    priority?: string;
    assignedTo?: string;
    search?: string;
  }) => {
    const response = await apiClient.get<
      PaginatedResponse<{ tickets: Ticket[] }>
    >("/api/tickets", { params });
    return response.data;
  },

  getTicket: async (id: string) => {
    const response = await apiClient.get<ApiResponse<{ ticket: Ticket }>>(
      `/api/tickets/${id}`
    );
    return response.data;
  },

  updateTicket: async (id: string, data: Record<string, unknown>) => {
    const response = await apiClient.patch<ApiResponse<{ ticket: Ticket }>>(
      `/api/tickets/${id}`,
      data
    );
    return response.data;
  },

  getBreachedTickets: async (params?: { limit?: number; offset?: number }) => {
    const response = await apiClient.get<
      PaginatedResponse<{ tickets: Ticket[] }>
    >("/api/tickets/breached", { params });
    return response.data;
  },
};

// Comments API
export const commentsApi = {
  createComment: async (
    ticketId: string,
    data: {
      content: string;
      parentComment?: string;
    }
  ) => {
    const response = await apiClient.post<ApiResponse<{ comment: Comment }>>(
      `/api/tickets/${ticketId}/comments`,
      data
    );
    return response.data;
  },

  getComments: async (
    ticketId: string,
    params?: {
      limit?: number;
      offset?: number;
    }
  ) => {
    const response = await apiClient.get<
      PaginatedResponse<{ comments: Comment[] }>
    >(`/api/tickets/${ticketId}/comments`, { params });
    return response.data;
  },

  getTimeline: async (
    ticketId: string,
    params?: {
      limit?: number;
      offset?: number;
    }
  ) => {
    const response = await apiClient.get<
      PaginatedResponse<{ timeline: TimelineLog[] }>
    >(`/api/tickets/${ticketId}/timeline`, { params });
    return response.data;
  },
};

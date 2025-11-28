import axios from "axios";

// Since we're using a different API for FAQs, we'll keep the existing one
const API_BASE_URL = "https://faq-crud.onrender.com/api/faqs";

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-storage");
    if (token) {
      try {
        const authData = JSON.parse(token);
        if (authData.state && authData.state.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`;
        }
      } catch (e) {
        console.error("Error parsing auth token:", e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const faqService = {
  getAllFaqs: async () => {
    try {
      const response = await apiClient.get("/");
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch FAQs");
    }
  },

  createFaq: async (faqData) => {
    try {
      const response = await apiClient.post("/", faqData);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create FAQ");
    }
  },

  updateFaq: async (id, faqData) => {
    try {
      const response = await apiClient.put(`/${id}`, faqData);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update FAQ");
    }
  },

  deleteFaq: async (id) => {
    try {
      await apiClient.delete(`/${id}`);
      return id;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete FAQ");
    }
  },
};

export default faqService;

import axios from "axios";

const API_BASE_URL = "https://faq-crud.onrender.com/api/faqs";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

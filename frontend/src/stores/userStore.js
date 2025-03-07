import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

const API_URL = "https://disability-careers.onrender.com/api";

axios.defaults.withCredentials = true;

export const userStore = create((set) => ({
  isLoading: false,
  error: null,
  users: [],
  profileData: null,
  isuploadDisabilityId: false,
  isuploadEmployerId: false,

  searchUsers: async (fullName) => {
    if (!fullName.trim()) {
      set({ error: "Full name is required", users: [] });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/users/search`, {
        params: { fullName },
      });

      set({ users: response.data, isLoading: false });
    } catch (error) {
      console.error("Error searching users:", error);
      set({
        error: error.response?.data?.message || "Something went wrong",
        users: [],
        isLoading: false,
      });
    }
  },

  fetchUserData: async (userId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      set({
        profileData: response.data,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      set({
        error: "Failed to load user data",
        isLoading: false,
      });
    }
  },

  contactForm: {
    name: "",
    email: "",
    subject: "",
    message: "",
    success: null,
  },

  setContactField: (field, value) =>
    set((state) => ({
      contactForm: { ...state.contactForm, [field]: value },
    })),

  sendContactForm: async () => {
    const { name, email, subject, message } = userStore.getState().contactForm;

    if (!name || !email || !subject || !message) {
      set({ error: "All fields are required." });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/contact/`, {
        name,
        email,
        subject,
        message,
      });

      set({
        contactForm: {
          name: "",
          email: "",
          subject: "",
          message: "",
          success: response.data.message,
        },
        isLoading: false,
      });
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error sending contact form:", error);
      set({
        error: error.response?.data?.error || "Failed to send message",
        isLoading: false,
      });
    }
  },

  uploadDisabilityId: async (data) => {
    set({ isuploadDisabilityId: true });
    try {
      const response = await axios.put(
        `${API_URL}/profilesettings/upload-disabilityId`,
        data
      );
      set({ user: response.data });
      toast.success("Disability ID updated successfully");
    } catch (error) {
      console.log("error in Disability ID:", error);
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        console.log("An unexpected error occurred. Please try again.");

      }
    } finally {
      set({ isuploadDisabilityId: false });
    }
  },

  uploadEmployerId: async (data) => {
    set({ isuploadEmployerId: true });
    try {
      const response = await axios.put(
        `${API_URL}/profilesettings/upload-employerId`,
        data
      );
      set({ user: response.data });
      toast.success("Employer ID updated successfully");
    } catch (error) {
      console.log("error in Employer ID:", error);
    } finally {
      set({ isuploadEmployerId: false });
    }
  },
}));

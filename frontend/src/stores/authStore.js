import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { create } from "zustand";


const API_URL = import.meta.env.NODE_ENV === "development" ? "https://disability-careers.onrender.com/api" : "/api";

const BASE_URL = "https://disability-careers.onrender.com";



axios.defaults.withCredentials = true;
export const authStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  isUpdatingCoverPhoto: false,
  isUpdatingCertificates: false,
  isUpdatingProfileInfo: false,
  isUpdatingResume: false,
  message: null,
  onlineUsers: [],
  notifications: [],
  socket: null,

  fetchNotifications: async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications/notify`);
      set({ notifications: response.data });
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  },

  markAllNotificationsAsRead: async () => {
    try {
      const response = await axios.patch(
        `${API_URL}/notifications/mark-all-read`
      );
      console.log(response.data);
      set((state) => ({
        notifications: state.notifications.map((notif) => ({
          ...notif,
          isRead: true,
        })),
      }));
      await get().fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  },

  signup: async (email, password, fullName, role, privacyAgreement) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
        fullName,
        role,
        privacyAgreement,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      get().connectSocket();
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      get().connectSocket();
    } catch (error) {
      set({
        error: error.response.data.message || "Error login",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/verify-email`, {
        code,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/auth/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
      get().connectSocket();
    } catch (error) {
      console.error("checkAuth error:", error.response?.data || error.message);
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/auth/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
      get().disconnectSocket();
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Error sending reset password email",
        isLoading: false,
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_URL}/auth/reset-password/${token}`,
        {
          password,
        }
      );
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axios.put(
        `${API_URL}/profilesettings/update-profile`,
        data
      );
      set({ user: response.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateCoverPhoto: async (data) => {
    set({ isUpdatingCoverPhoto: true });
    try {
      const response = await axios.put(
        `${API_URL}/profilesettings/update-coverPhoto`,
        data
      );
      set({ user: response.data });
      toast.success("Cover Photo updated successfully");
    } catch (error) {
      console.log("error in update cover photo:", error);
    } finally {
      set({ isUpdatingCoverPhoto: false });
    }
  },

  uploadCertificates: async (data) => {
    set({ isUpdatingCertificates: true });
    try {
      const response = await axios.put(
        `${API_URL}/profilesettings/user/certificates`,
        data
      );
      set({ user: response.data });
    } catch (error) {
      console.log("Error in uploading certificates", error);
    } finally {
      set({ isUpdatingCertificates: false });
    }
  },

  uploadResume: async (data) => {
    set({ isUpdatingResume: true });
    try {
      const response = await axios.put(`${API_URL}/user/resume`, data);
      set({ user: response.data });
    } catch (error) {
      console.log("Error in uploading resume", error);
    } finally {
      set({ isUpdatingResume: false });
    }
  },

  userProfileInfo: async (profileData) => {
    set({ isUpdatingProfileInfo: true, error: null });
    try {
      const response = await axios.put(
        `${API_URL}/profilesettings/user/profile`,
        profileData
      );
      set({ user: response.data.user });
      toast.success(response.data.message || "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user profile:", error);

      const errorMessage =
        error.response?.data?.message || "Failed to update profile.";
      set({ error: errorMessage });
    } finally {
      set({ isUpdatingProfileInfo: false });
    }
  },

  updateEmployerProfile: async (employerData) => {
    set({ isUpdatingProfileInfo: true, error: null });
    try {
      const response = await axios.put(
        `${API_URL}/profilesettings/user/employer-profile`,
        employerData
      );
      if (response.data?.user) {
        set({ user: response.data.user });
      }
      toast.success(response.data.message || "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user profile:", error);
      let errorMessage = "Failed to update profile.";
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      set({ error: errorMessage });
    } finally {
      set({ isUpdatingProfileInfo: false });
    }
  },

  updateAdminProfile: async (adminData) => {
    set({ isUpdatingProfileInfo: true, error: null });
    try {
      const response = await axios.put(
        `${API_URL}/admin/update-profile`,
        adminData
      );
      set({ user: response.data.admin });
      toast.success(response.data.message || "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating admin profile:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update profile.";
      set({ error: errorMessage });
    } finally {
      set({ isUpdatingProfileInfo: false });
    }
  },

  connectSocket: () => {
    const { user, socket } = get();
    if (!user || (socket && socket.connected)) return;

    const newSocket = io(BASE_URL, {
      query: { userId: user._id },
    });

    newSocket.connect();
    set({ socket: newSocket });

    newSocket.off("newUser");
    newSocket.off("newDisabilityId");
    newSocket.off("receiveMessage");
    newSocket.off("applicationShortlisted");
    newSocket.off("applicationRejected");
    newSocket.off("newJobApplication");
    newSocket.off("verificationUpdate");
    newSocket.off("interviewConfirmed");
    newSocket.off("interviewDeclined");
    newSocket.off("interviewScheduled");

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    newSocket.on("newUser", (data) => {
      toast.success(data.message);
      set((state) => ({
        notifications: [...state.notifications, data.message],
      }));
    });

    newSocket.on("newDisabilityId", (data) => {
      toast.success(data.message);
      set((state) => ({
        notifications: [...state.notifications, data.message],
      }));
    });

    newSocket.on("receiveMessage", (message) => {
      console.log("New message received:", message);
    });

    newSocket.on("interviewScheduled", (data) => {
      toast.success(data.message);
      set((state) => ({
        notifications: [...state.notifications, data.message],
      }));
    });

    newSocket.on("applicationShortlisted", (data) => {
      toast.success(data.message);
      set((state) => ({
        notifications: [...state.notifications, data.message],
      }));
    });

    newSocket.on("applicationRejected", (data) => {
      toast.success(data.message);
      set((state) => ({
        notifications: [...state.notifications, data.message],
      }));
    });

    newSocket.on("newJobApplication", (data) => {
      console.log("📩 New job application notification received:", data);
      toast.success(`New applicant for your job post!`);
      set((state) => ({
        notifications: [...state.notifications, data.message],
      }));
    });

    newSocket.on("verificationUpdate", (data) => {
      toast.success(data.message);
      set((state) => ({
        notifications: [...state.notifications, data.message],
      }));
    });

    newSocket.on("interviewConfirmed", (data) => {
      toast.success(data.message);
      set((state) => ({
        notifications: [...state.notifications, data.message],
      }));
    });

    newSocket.on("interviewDeclined", (data) => {
      set((state) => ({
        notifications: [...state.notifications, data.message],
      }));
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  },

  clearNotifications: () => set({ notifications: [] }),

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.off("newUser");
      socket.off("newDisabilityId");
      socket.off("receiveMessage");
      socket.off("applicationShortlisted");
      socket.off("applicationRejected");
      socket.off("newJobApplication");
      socket.off("verificationUpdate");
      socket.off("interviewConfirmed");
      socket.off("interviewDeclined");
      socket.off("interviewScheduled");
      socket.disconnect();
    }
  },
}));

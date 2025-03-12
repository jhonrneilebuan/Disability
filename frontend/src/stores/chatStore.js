import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { authStore } from "./authStore";

const API_URL = "https://disability-careers.onrender.com/api";
axios.defaults.withCredentials = true;

export const chatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  getUsersForSidebar: async () => {
    set({ isUserLoading: true });
    try {
      const response = await axios.get(`${API_URL}/messages/users`);
      set({ users: response.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: false });
    try {
      const response = await axios.get(`${API_URL}/messages/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const response = await axios.post(
        `${API_URL}/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, response.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = authStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = authStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  startPolling: () => {
    const interval = setInterval(() => {
      get().getUsersForSidebar();
    }, 30000);
    set({ pollingInterval: interval });
  },

  stopPolling: () => {
    clearInterval(get().pollingInterval);
  },
}));

import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../config/axios";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    // Set functions
    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data.data })
        } catch(error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data.data })
        } catch(error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (message) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, message, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log("response of send message: ", res);
            set({messages: [...messages, res.data]});
        } catch (error) {
            toast.error(error.response.data.message); 
        }
    },

    setSelectedUser: (selectedUser) => {
        set({ selectedUser })
    }
}))
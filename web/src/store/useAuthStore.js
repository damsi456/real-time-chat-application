import { create } from 'zustand';
import { axiosInstance } from '../config/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    // Set
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });

            get().connectSocket();
        } catch(error) {
            console.error("Error in checkAuth: ", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signUp: async (payload) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", payload)
            console.log("response: ", res);
            if (res.status === 201) {
                set({ authUser: res.data });
                toast.success("Account created successfully.");

                get().connectSocket();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to sign up");
            console.log(error?.response?.data?.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    logIn: async (payload) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", payload)
            console.log("response of login: ", res);
            if (res.status === 200) {
                set({ authUser: res.data.data });
                toast.success("Logged In successfully.");

                get().connectSocket();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to log in");
            console.log(error?.response?.data?.message);       
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logOut: async () => {
        try {
            const res = await axiosInstance.post("/auth/logout");
            if (res.status === 200) {
                set({ authUser: null });
                toast.success(res.data.message);

                get().disconnectSocket();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to logout.");
            console.log(error?.response?.data?.message);
        }
    },

    updateProfile: async (formData) => {
        set({ isUpdatingProfile: true});
        try {
            const res = await axiosInstance.put("/profile/update", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            console.log("response of profile update: ", res);
            if (res.status === 200) {
                set({ authUser: res.data.user });
                toast.success("Profile uploaded successfully.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update profile");
            console.log(error?.response?.data?.message);       
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        // Not connecting if user is not authenticated or already connected
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        }); 
        socket.connect();

        set({ socket: socket });
        
        // Listen for online users updates
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        })
    },

    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
        }
    }
}));
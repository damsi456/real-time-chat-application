import { create } from 'zustand';
import { axiosInstance } from '../config/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    // Set
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
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
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to sign up");
            console.log(error?.response?.data?.message);
        } finally {
            set({ isSigningUp: false });
        }
    }
}));
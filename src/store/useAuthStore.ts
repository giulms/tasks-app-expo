import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const baseURL = process.env.EXPO_PUBLIC_API_URL;
// baseURL is e.g. "http://localhost:5555" — strip any trailing path and append /api/auth
const authURL = `${(baseURL || '').replace(/\/api\/.*$/, '')}/api/auth`;

interface AuthState {
    token: string | null;
    email: string | null;
    _hydrated: boolean;
    signup: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            email: null,
            _hydrated: false,
            signup: async (email, password) => {
                const { data } = await axios.post(`${authURL}/signup`, { email, password });
                set({ token: data.token, email: data.user.email });
            },
            login: async (email, password) => {
                const { data } = await axios.post(`${authURL}/login`, { email, password });
                set({ token: data.token, email: data.user.email });
            },
            logout: () => {
                set({ token: null, email: null });
            },
        }),
        {
            name: 'auth-store',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: ({ _hydrated, ...rest }: AuthState) => rest,
            onRehydrateStorage: () => (_state, _error) => {
                useAuthStore.setState({ _hydrated: true });
            },
        }
    )
);

export default useAuthStore;

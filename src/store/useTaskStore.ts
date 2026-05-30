import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { TaskItem } from '../utils/handle-api';
import useAuthStore from './useAuthStore';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

const authHeaders = () => {
    const token = useAuthStore.getState().token;
    return token ? { Authorization: `Bearer ${token}` } : {};
};

interface TaskState {
    tasks: TaskItem[];
    loading: boolean;
    filter: 'all' | 'completed' | 'pending';
    editingTask: TaskItem | null;
    _hydrated: boolean;
    fetchTasks: () => void;
    addTask: (text: string, completed: boolean, dueDate: string | null, onSuccess: () => void) => void;
    updateTask: (taskId: string, text: string, completed: boolean, dueDate: string | null, onSuccess: () => void) => void;
    deleteTask: (id: string) => void;
    deleteAllTasks: () => void;
    setFilter: (filter: 'all' | 'completed' | 'pending') => void;
    setEditingTask: (task: TaskItem | null) => void;
}

const useTaskStore = create<TaskState>()(
    persist(
        (set, get) => ({
            tasks: [],
            loading: false,
            filter: 'all',
            editingTask: null,
            _hydrated: false,
            fetchTasks: () => {
                set({ loading: true });
                axios.get<TaskItem[]>(`${baseURL}`, { headers: authHeaders() })
                    .then(({ data }) => set({ tasks: data, loading: false }))
                    .catch((err) => { console.log(err); set({ loading: false }); });
            },
            addTask: (text, completed, dueDate, onSuccess) => {
                axios.post(`${baseURL}/save`, { text, completed, dueDate }, { headers: authHeaders() })
                    .then(() => { onSuccess(); get().fetchTasks(); })
                    .catch((err) => console.log(err));
            },
            updateTask: (taskId, text, completed, dueDate, onSuccess) => {
                axios.post(`${baseURL}/update`, { _id: taskId, text, completed, dueDate }, { headers: authHeaders() })
                    .then(() => { onSuccess(); get().fetchTasks(); })
                    .catch((err) => console.log(err));
            },
            deleteTask: (id) => {
                axios.post(`${baseURL}/delete`, { _id: id }, { headers: authHeaders() })
                    .then(() => get().fetchTasks())
                    .catch((err) => console.log(err));
            },
            deleteAllTasks: () => set({ tasks: [] }),
            setFilter: (filter) => set({ filter }),
            setEditingTask: (task) => set({ editingTask: task }),
        }),
        {
            name: 'task-store',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: ({ _hydrated, ...rest }: TaskState) => rest,
            onRehydrateStorage: () => (_state, _error) => {
                useTaskStore.setState({ _hydrated: true });
            },
        }
    )
);

export default useTaskStore;

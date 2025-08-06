import axios from "axios";
import { API_DOMAIN } from "@/configs/api";
import { getAuthToken } from "@/lib/cookie";
import type { TodoResponse, CreateTodoRequest, UpdateTodoRequest } from "@/types/todo";

const api = axios.create({
    baseURL: API_DOMAIN,
});

// 添加請求攔截器來自動添加 token
api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export const todoApi = {
    // 獲取所有 todos
    async getTodos(): Promise<TodoResponse> {
        const response = await api.get<TodoResponse>("/todos/");
        return response.data;
    },

    // 創建新的 todo
    async createTodo(data: CreateTodoRequest): Promise<void> {
        await api.post("/todos/", data);
    },

    // 更新 todo 內容
    async updateTodo(id: string, data: UpdateTodoRequest): Promise<void> {
        await api.put(`/todos/${id}`, data);
    },

    // 刪除 todo
    async deleteTodo(id: string): Promise<void> {
        await api.delete(`/todos/${id}`);
    },

    // 切換 todo 狀態
    async toggleTodo(id: string): Promise<void> {
        console.log("toggleTodo in: ", id);
        await api.patch(`/todos/${id}/toggle`);
    },
};

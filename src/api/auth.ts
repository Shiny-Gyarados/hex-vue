import axios from "axios";
import { API_DOMAIN } from "@/configs/api";
import { getAuthToken, clearAuthCookies } from "@/lib/cookie";

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

export const authApi = {
    // 登出功能
    async signOut(): Promise<void> {
        await api.post("/users/sign_out");
        // API 成功後清除本地的認證 cookies
        clearAuthCookies();
    },
};

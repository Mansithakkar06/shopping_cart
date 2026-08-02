import axios from "axios"
import { store } from "../store/store"
import { logoutUser } from "../features/AuthSlice"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})

// Request Interceptor: Automatically attach Bearer accessToken if present in localStorage
api.interceptors.request.use(
    (config) => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            if (user?.accessToken) {
                config.headers.Authorization = `Bearer ${user.accessToken}`;
            }
        } catch (e) {
            // Ignore parse errors
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const user = JSON.parse(localStorage.getItem("user") || "null");
            if (!user) {
                return Promise.reject(error);
            }

            try {
                const refreshRes = await axios.post(
                    `${BASE_URL}/auth/refreshToken`,
                    { refreshToken: user.refreshToken },
                    { withCredentials: true }
                );

                const newAccessToken = refreshRes.data?.accessToken;
                const newRefreshToken = refreshRes.data?.refreshToken;

                if (newAccessToken) {
                    const updatedUser = {
                        ...user,
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken || user.refreshToken
                    };
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem("user");
                store.dispatch(logoutUser());
                
                if (refreshError.response?.data?.message === "no refresh token token!!") {
                    refreshError.isSilent = true;
                }
                
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
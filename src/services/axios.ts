import axios from 'axios'

export const apiUrl = import.meta.env.VITE_APP_API_URL;
export const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
export const uploadUrl = import.meta.env.VITE_APP_BACKEND_UPLOAD_URL;

export const authInstance = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const instance = axios.create({
    baseURL: apiUrl,
    headers: { 'Content-Type': 'application/json' }
})

authInstance.interceptors.request.use(
    (config) => {
        const rawUser = localStorage.getItem('user')
        if (!rawUser) {
            return config
        }

        let user: {
            token?: string;
            access_token?: string;
            token_type?: string;
            data?: { token?: string; access_token?: string; token_type?: string };
            user?: { token?: string; access_token?: string; token_type?: string };
        } | null = null
        try {
            user = JSON.parse(rawUser)
        } catch {
            return config
        }

        const token =
            user?.token ||
            user?.access_token ||
            user?.data?.token ||
            user?.data?.access_token ||
            user?.user?.token ||
            user?.user?.access_token
        const token_type =
            (user?.token_type || user?.data?.token_type || user?.user?.token_type || 'Bearer').trim()
        if (token) {
            config.headers.Authorization = `${token_type} ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

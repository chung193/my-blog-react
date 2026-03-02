import { authInstance, instance } from "./axios";
import type { AxiosRequestConfig } from "axios";

const apiService = {
    get: (url: string, params: Record<string, unknown> = {}): Promise<any> => instance.get(url, { params }),
    authGet: (url: string, params: Record<string, unknown> = {}): Promise<any> => authInstance.get(url, { params }),
    post: (url: string, data: unknown = {}): Promise<any> => instance.post(url, data),
    authPost: (url: string, data: unknown = {}): Promise<any> => authInstance.post(url, data),
    postWithMedia: (url: string, formData: FormData): Promise<any> => instance.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    putWithMedia: (url: string, formData: FormData): Promise<any> => {
        formData.append('_method', 'PUT');
        return instance.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    profile: () => instance.get('profile'),
    put: (url: string, data: unknown = {}): Promise<any> => instance.put(url, data),
    patch: (url: string, data: unknown = {}): Promise<any> => instance.patch(url, data),
    delete: (url: string): Promise<any> => instance.delete(url),
    exportExcel: (url: string, data: unknown = null): Promise<any> => {
        const config: AxiosRequestConfig = { responseType: 'blob' };
        return instance.post(url, data, config);
    }
}

export default apiService

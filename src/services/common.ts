import { authInstance, instance } from "./axios";

const apiService = {
    get: (url, params = {}) => instance.get(url, { params }),
    authGet: (url, params = {}) => authInstance.get(url, { params }),
    post: (url, data = {}) => instance.post(url, data),
    authPost: (url, data = {}) => authInstance.post(url, data),
    postWithMedia: (url, formData = {}) => instance.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    putWithMedia: (url, formData = {}) => {
        formData.append('_method', 'PUT');
        return instance.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    profile: () => instance.get('profile'),
    put: (url, data = {}) => instance.put(url, data),
    patch: (url, data = {}) => instance.patch(url, data),
    delete: (url) => instance.delete(url),
    exportExcel: async (url, data = null) => {
        instance.post(url, data,
            {
                responseType: 'blob',
            }
        )
    }
}

export default apiService

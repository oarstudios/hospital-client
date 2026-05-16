    import axiosInstance from '../../app/axiosinstance';

    const BASE = '/blogs';

    /** GET /blogs */
  export const fetchBlogsApi = (params = {}) =>
  axiosInstance.get(`${BASE}?t=${Date.now()}`, { params });

    /** GET /blogs/:id */
    export const fetchBlogByIdApi = (id) =>
    axiosInstance.get(`${BASE}/${id}`);

    /** GET /blogs/slug/:slug */
    export const fetchBlogBySlugApi = (slug) =>
    axiosInstance.get(`${BASE}/slug/${slug}`);

    /**
     * POST /blogs  (multipart: image)
     * @param {FormData} formData
     */
    export const createBlogApi = (formData) =>
    axiosInstance.post(BASE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    /**
     * PUT /blogs/:id  (multipart: image?)
     * @param {number}   id
     * @param {FormData} formData
     */
    export const updateBlogApi = (id, formData) =>
    axiosInstance.put(`${BASE}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    /** DELETE /blogs/:id */
    export const deleteBlogApi = (id) =>
    axiosInstance.delete(`${BASE}/${id}`);

    /** PUT /blogs/restore/:id */
    export const restoreBlogApi = (id) =>
    axiosInstance.put(`${BASE}/restore/${id}`);
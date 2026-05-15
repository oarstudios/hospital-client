import axiosInstance from '../../app/axiosinstance';

const BASE = '/centers';

/** GET /centers */
export const fetchCentersApi = (params = {}) =>
  axiosInstance.get(BASE, { params });

/** GET /centers/:id */
export const fetchCenterByIdApi = (id) =>
  axiosInstance.get(`${BASE}/${id}`);

/**
 * POST /centers  (multipart: heroImage, centerImage, gallery[])
 * @param {FormData} formData
 */
export const createCenterApi = (formData) =>
  axiosInstance.post(BASE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

/**
 * PUT /centers/:id
 * @param {number} id
 * @param {Object} data — plain JSON body (no file upload on update per the controller)
 */
export const updateCenterApi = (id, data) =>
  axiosInstance.put(`${BASE}/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

/** DELETE /centers/:id */
export const deleteCenterApi = (id) =>
  axiosInstance.delete(`${BASE}/${id}`);

/** PUT /centers/restore/:id */
export const restoreCenterApi = (id) =>
  axiosInstance.put(`${BASE}/restore/${id}`);
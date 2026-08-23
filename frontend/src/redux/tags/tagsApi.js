import axiosInstance from '../../app/axiosinstance';

const BASE = '/tags';

/** GET /tags */
export const fetchTagsApi = () =>
  axiosInstance.get(BASE);

/** POST /tags  — creates a new tag, or returns the existing one if the
 *  name already matches (case-insensitive) something already stored. */
export const createTagApi = (tag) =>
  axiosInstance.post(BASE, { tag });

export const deleteTagApi = (id) =>
  axiosInstance.delete(`${BASE}/${id}`);
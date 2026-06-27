import axiosInstance from '../../app/axiosinstance';

const BASE = '/appointments';

/**
 * POST /appointments
 * Public — hit directly by the website's Book Appointment forms.
 * @param {Object} data  { patientName, age, phone, area, center, centerId, appointmentDate, source }
 */
export const createAppointmentApi = (data) =>
  axiosInstance.post(BASE, data);

/**
 * GET /appointments
 * Used by the admin Manage Appointments table.
 */
export const fetchAppointmentsApi = (params = {}) =>
  axiosInstance.get(BASE, { params });

/** GET /appointments/stats */
export const fetchAppointmentStatsApi = () =>
  axiosInstance.get(`${BASE}/stats`);

/** PUT /appointments/:id  (e.g. { status: 'Confirmed' }) */
export const updateAppointmentApi = (id, data) =>
  axiosInstance.put(`${BASE}/${id}`, data);

/** DELETE /appointments/:id */
export const deleteAppointmentApi = (id) =>
  axiosInstance.delete(`${BASE}/${id}`);

/** PUT /appointments/restore/:id */
export const restoreAppointmentApi = (id) =>
  axiosInstance.put(`${BASE}/restore/${id}`);
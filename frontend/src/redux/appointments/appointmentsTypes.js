/**
 * Appointment State Shape
 *
 * @typedef {Object} Appointment
 * @property {number}      id
 * @property {string}      patientName
 * @property {number|null} age
 * @property {string}      phone
 * @property {string|null} area
 * @property {string|null} center
 * @property {number|null} centerId
 * @property {string|null} appointmentDate
 * @property {string}      source
 * @property {string}      status
 * @property {boolean}     isDeleted
 * @property {string}      createdAt
 * @property {string}      updatedAt
 *
 * @typedef {Object} AppointmentsState
 * @property {Appointment[]} list
 * @property {number}        total
 * @property {number}        page
 * @property {number}        limit
 * @property {number}        totalPages
 * @property {Object|null}   stats
 * @property {boolean}       loading
 * @property {string|null}   error
 */

export const APPOINTMENTS_INITIAL_STATE = {
  list: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  stats: null,
  loading: false,
  error: null,
};
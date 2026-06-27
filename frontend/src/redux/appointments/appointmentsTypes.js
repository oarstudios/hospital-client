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
 * @property {Appointment[]} list      - All appointments (admin table)
 * @property {Object|null}   stats     - { totalAppointments, pending, confirmed, cancelled }
 * @property {boolean}       loading
 * @property {string|null}   error
 */

export const APPOINTMENTS_INITIAL_STATE = {
  list: [],
  stats: null,
  loading: false,
  error: null,
};
/**
 * Auth State Shape
 *
 * @typedef {Object} AuthState
 * @property {{ id: number, username: string } | null} user   - logged-in user info
 * @property {boolean} isAuthenticated                         - true when a valid session exists
 * @property {boolean} loading                                 - true during any auth API call
 * @property {string | null} error                             - last error message
 */

export const AUTH_INITIAL_STATE = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};
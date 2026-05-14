/**
 * Center State Shape
 *
 * @typedef {Object} Center
 * @property {number}      id
 * @property {string}      slug
 * @property {string}      name
 * @property {string|null} heroImage
 * @property {string|null} centerImage
 * @property {string[]}    gallery
 * @property {boolean}     isDeleted
 * @property {string}      createdAt
 * @property {string}      updatedAt
 *
 * @typedef {Object} CentersState
 * @property {Center[]}    list
 * @property {Center|null} selected
 * @property {boolean}     loading
 * @property {string|null} error
 */

export const CENTERS_INITIAL_STATE = {
  list: [],
  selected: null,
  loading: false,
  error: null,
};
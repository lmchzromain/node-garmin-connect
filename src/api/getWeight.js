import { makeClient } from '../utils/client.js';

/**
 * Returns weight and body composition data for a given date.
 * @param {object} oauth2 - OAuth2 token
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<object>}
 */
export const getWeight = (oauth2, date) =>
  makeClient(oauth2)
    .get('weight-service/weight/dateRange', { searchParams: { startDate: date, endDate: date } })
    .json();

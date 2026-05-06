import { makeClient } from '../utils/client.js';

/**
 * Returns the Heart Rate Variability (HRV) data for a given date.
 * @param {object} oauth2 - OAuth2 token
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<object>}
 */
export const getHrv = (oauth2, date) =>
  makeClient(oauth2).get(`hrv-service/hrv/${date}`).json();

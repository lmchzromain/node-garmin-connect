import { makeClient } from '../utils/client.js';

/**
 * Returns max metrics for a given date, including VO2max (running and cycling).
 * @param {object} oauth2 - OAuth2 token
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<object>}
 */
export const getMaxMetrics = (oauth2, date) =>
  makeClient(oauth2).get(`metrics-service/metrics/maxmet/daily/${date}/${date}`).json();

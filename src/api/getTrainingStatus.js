import { makeClient } from '../utils/client.js';

/**
 * Returns the aggregated training status for a given date (load, form, fitness…).
 * @param {object} oauth2 - OAuth2 token
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<object>}
 */
export const getTrainingStatus = (oauth2, date) =>
  makeClient(oauth2).get(`metrics-service/metrics/trainingstatus/aggregated/${date}`).json();

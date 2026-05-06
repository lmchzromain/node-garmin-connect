import { makeClient } from '../utils/client.js';

/**
 * Returns the training readiness score and breakdown for a given date.
 * @param {object} oauth2 - OAuth2 token
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<object>}
 */
export const getTrainingReadiness = (oauth2, date) =>
  makeClient(oauth2).get(`metrics-service/metrics/trainingreadiness/${date}`).json();

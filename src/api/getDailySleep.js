import { makeClient } from '../utils/client.js';

/**
 * Returns sleep data for a given date (duration, stages, sleep score…).
 * @param {object} oauth2 - OAuth2 token
 * @param {string} displayName - Garmin display name of the user
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<object>}
 */
export const getDailySleep = (oauth2, displayName, date) =>
  makeClient(oauth2)
    .get(`wellness-service/wellness/dailySleepData/${displayName}`, { searchParams: { date } })
    .json();

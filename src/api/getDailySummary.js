import { makeClient } from '../utils/client.js';

/**
 * Returns the daily wellness summary for a given date (steps, calories, stress, resting HR…).
 * @param {object} oauth2 - OAuth2 token
 * @param {string} displayName - Garmin display name of the user
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<object>}
 */
export const getDailySummary = (oauth2, displayName, date) =>
  makeClient(oauth2)
    .get(`usersummary-service/usersummary/daily/${displayName}`, {
      searchParams: { calendarDate: date },
    })
    .json();

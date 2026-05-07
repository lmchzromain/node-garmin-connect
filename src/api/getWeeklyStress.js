import { makeClient } from '../utils/client.js';

/**
 * Returns weekly stress aggregates ending at endDate for the given number of weeks.
 * @param {object} oauth2
 * @param {string} endDate - YYYY-MM-DD
 * @param {number} weeks
 * @returns {Promise<object[]>}
 */
export const getWeeklyStress = (oauth2, endDate, weeks = 52) =>
  makeClient(oauth2)
    .get(`usersummary-service/stats/stress/weekly/${endDate}/${weeks}`)
    .json();

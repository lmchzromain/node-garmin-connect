import { makeClient } from '../utils/client.js';
import { lastNDays } from '../utils/dates.js';

/**
 * @param {object} raw
 * @returns {{ date, weeklyAvg, lastNightAvg, lastNight5MinHigh, status, baseline }}
 */
const parse = ({ hrvSummary }) => ({
  date: hrvSummary?.calendarDate,
  weeklyAvg: hrvSummary?.weeklyAvg,
  lastNightAvg: hrvSummary?.lastNightAvg,
  lastNight5MinHigh: hrvSummary?.lastNight5MinHigh,
  status: hrvSummary?.status,
  baseline: hrvSummary?.baseline,
});

/**
 * Returns parsed HRV summary for the last 30 days (no minute-by-minute readings).
 * @param {object} oauth2 - OAuth2 token
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<object[]>}
 */
export const getMonthlyHrv = (oauth2, endDate) =>
  Promise.all(
    lastNDays(endDate, 30).map((date) =>
      makeClient(oauth2).get(`hrv-service/hrv/${date}`).json().then(parse),
    ),
  );

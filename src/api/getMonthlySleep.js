import { makeClient } from '../utils/client.js';
import { lastNDays } from '../utils/dates.js';

/**
 * @param {object} raw
 * @returns {{ date, duration, score, deepSleep, lightSleep, remSleep, awakeSleep }}
 */
const parse = ({ dailySleepDTO }) => ({
  date: dailySleepDTO?.calendarDate,
  duration: dailySleepDTO?.sleepTimeSeconds,
  score: dailySleepDTO?.sleepScores?.overall?.value,
  deepSleep: dailySleepDTO?.deepSleepSeconds,
  lightSleep: dailySleepDTO?.lightSleepSeconds,
  remSleep: dailySleepDTO?.remSleepSeconds,
  awakeSleep: dailySleepDTO?.awakeSleepSeconds,
});

/**
 * Returns parsed sleep data for the last 30 days.
 * @param {object} oauth2 - OAuth2 token
 * @param {string} displayName - Garmin display name of the user
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<object[]>}
 */
export const getMonthlySleep = (oauth2, displayName, endDate) =>
  Promise.all(
    lastNDays(endDate, 30).map((date) =>
      makeClient(oauth2)
        .get(`wellness-service/wellness/dailySleepData/${displayName}`, {
          searchParams: { date },
        })
        .json()
        .then(parse),
    ),
  );

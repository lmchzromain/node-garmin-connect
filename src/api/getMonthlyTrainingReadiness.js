import { makeClient } from '../utils/client.js';
import { lastNDays } from '../utils/dates.js';

/**
 * @param {object[]} entries
 * @returns {{ date, score, level, feedbackShort, sleepScore, recoveryTime, hrvWeeklyAverage }}
 */
const parse = (entries) => {
  const entry =
    entries.find((e) => e.inputContext === 'AFTER_WAKEUP_RESET') ?? entries[0];
  return {
    date: entry?.calendarDate,
    score: entry?.score,
    level: entry?.level,
    feedbackShort: entry?.feedbackShort,
    sleepScore: entry?.sleepScore,
    recoveryTime: entry?.recoveryTime,
    hrvWeeklyAverage: entry?.hrvWeeklyAverage,
  };
};

/**
 * Returns parsed training readiness for the last 30 days (AFTER_WAKEUP_RESET entry only).
 * @param {object} oauth2 - OAuth2 token
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<object[]>}
 */
export const getMonthlyTrainingReadiness = (oauth2, endDate, days = 30) =>
  Promise.all(
    lastNDays(endDate, days).map((date) =>
      makeClient(oauth2)
        .get(`metrics-service/metrics/trainingreadiness/${date}`)
        .json()
        .then(parse),
    ),
  );

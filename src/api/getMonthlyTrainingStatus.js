import { makeClient } from '../utils/client.js';
import { lastNDays } from '../utils/dates.js';

/**
 * @param {object} raw
 * @returns {{ date, vo2MaxRunning, vo2MaxCycling, trainingStatus, statusFeedback, acuteLoad, chronicLoad }}
 */
const parse = (raw) => {
  const primaryDevice = Object.values(
    raw.mostRecentTrainingStatus?.latestTrainingStatusData ?? {},
  ).find((d) => d.primaryTrainingDevice);

  return {
    date: raw.mostRecentTrainingStatus?.lastPrimarySyncDate,
    vo2MaxRunning: raw.mostRecentVO2Max?.generic?.vo2MaxValue,
    vo2MaxCycling: raw.mostRecentVO2Max?.cycling?.vo2MaxValue,
    trainingStatus: primaryDevice?.trainingStatus,
    statusFeedback: primaryDevice?.trainingStatusFeedbackPhrase,
    acuteLoad: primaryDevice?.acuteTrainingLoadDTO?.dailyTrainingLoadAcute,
    chronicLoad: primaryDevice?.acuteTrainingLoadDTO?.dailyTrainingLoadChronic,
  };
};

/**
 * Returns parsed training status for the last 30 days.
 * @param {object} oauth2 - OAuth2 token
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<object[]>}
 */
export const getMonthlyTrainingStatus = (oauth2, endDate) =>
  Promise.all(
    lastNDays(endDate, 30).map((date) =>
      makeClient(oauth2)
        .get(`metrics-service/metrics/trainingstatus/aggregated/${date}`)
        .json()
        .then(parse),
    ),
  );

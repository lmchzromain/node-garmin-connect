import { makeClient } from '../utils/client.js';

const parse = ({
  activityId, activityName, startTimeLocal, activityType,
  distance, duration, elevationGain, averageSpeed, averageHR, maxHR,
  aerobicTrainingEffect, anaerobicTrainingEffect, trainingEffectLabel,
  activityTrainingLoad, vO2MaxValue,
}) => ({
  activityId,
  name: activityName,
  date: startTimeLocal,
  type: activityType?.typeKey,
  distance,
  duration,
  elevationGain,
  averageSpeed,
  averageHR,
  maxHR,
  aerobicTrainingEffect,
  anaerobicTrainingEffect,
  trainingEffectLabel,
  activityTrainingLoad,
  vO2MaxValue,
});

/**
 * Returns a paginated list of the user's activities with coach-relevant fields only.
 * @param {object} oauth2 - OAuth2 token
 * @param {object} [options]
 * @param {number} [options.limit=20] - Number of activities to return
 * @param {number} [options.start=0] - Offset for pagination
 * @param {string} [options.startDate] - Filter from date (YYYY-MM-DD, inclusive)
 * @param {string} [options.endDate] - Filter to date (YYYY-MM-DD, inclusive)
 * @returns {Promise<object[]>}
 */
export const getActivities = (oauth2, { limit = 20, start = 0, startDate, endDate } = {}) =>
  makeClient(oauth2)
    .get('activitylist-service/activities/search/activities', {
      searchParams: { start, limit, ...(startDate && { startDate }), ...(endDate && { endDate }) },
    })
    .json()
    .then((records) => records.map(parse));

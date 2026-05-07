import { makeClient } from '../utils/client.js';

const parse = ({ date, charged, drained }) => ({ date, charged, drained });

/**
 * Returns daily body battery charged/drained for a date range.
 * @param {object} oauth2
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate - YYYY-MM-DD
 * @returns {Promise<{ date, charged, drained }[]>}
 */
export const getBodyBattery = (oauth2, startDate, endDate) =>
  makeClient(oauth2)
    .get('wellness-service/wellness/bodyBattery/reports/daily', {
      searchParams: { startDate, endDate },
    })
    .json()
    .then((records) => records.map(parse));

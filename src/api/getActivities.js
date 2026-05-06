import { makeClient } from '../utils/client.js';

/**
 * Returns a paginated list of the user's activities, ordered by most recent.
 * @param {object} oauth2 - OAuth2 token
 * @param {object} [options]
 * @param {number} [options.limit=20] - Number of activities to return
 * @param {number} [options.start=0] - Offset for pagination
 * @returns {Promise<object[]>}
 */
export const getActivities = (oauth2, { limit = 20, start = 0 } = {}) =>
  makeClient(oauth2)
    .get('activitylist-service/activities/search/activities', { searchParams: { start, limit } })
    .json();

import { makeClient } from '../utils/client.js';

const PR_DISTANCE = { 1: '1km', 2: '1mile', 3: '5km', 4: '10km', 5: 'half-marathon', 6: 'marathon', 7: 'longest' };

/**
 * Returns parsed running personal records for the authenticated user.
 * value is in seconds for time-based PRs (1km–marathon), meters for longest.
 * @param {object} oauth2 - OAuth2 token
 * @param {string} displayName - Garmin display name of the user
 * @returns {Promise<{ distance, date, value }[]>}
 */
export const getPersonalRecords = (oauth2, displayName) =>
  makeClient(oauth2)
    .get(`personalrecord-service/personalrecord/prs/${displayName}`)
    .json()
    .then((records) =>
      records
        .filter((r) => r.activityType === 'running' && PR_DISTANCE[r.typeId])
        .map(({ typeId, actStartDateTimeInGMTFormatted, value }) => ({
          distance: PR_DISTANCE[typeId],
          date: actStartDateTimeInGMTFormatted,
          value,
        })),
    );

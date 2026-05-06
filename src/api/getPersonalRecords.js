import { makeClient } from '../utils/client.js';

/**
 * Returns all personal records (PRs) for the authenticated user across all activity types.
 * @param {object} oauth2 - OAuth2 token
 * @param {string} displayName - Garmin display name of the user
 * @returns {Promise<object[]>}
 */
export const getPersonalRecords = (oauth2, displayName) =>
  makeClient(oauth2).get(`personalrecord-service/personalrecord/prs/${displayName}`).json();

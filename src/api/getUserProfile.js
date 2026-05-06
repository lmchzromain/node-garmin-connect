import { makeClient } from '../utils/client.js';

/**
 * Returns the authenticated user's profile settings (units, locale, preferences…).
 * @param {object} oauth2 - OAuth2 token
 * @returns {Promise<object>}
 */
export const getUserProfile = (oauth2) =>
  makeClient(oauth2).get('userprofile-service/userprofile/user-settings').json();

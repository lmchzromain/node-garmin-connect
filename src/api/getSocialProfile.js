import { makeClient } from '../utils/client.js';

/**
 * Returns the social profile of the authenticated user (displayName, fullName, location…).
 * @param {object} oauth2 - OAuth2 token
 * @returns {Promise<object>}
 */
export const getSocialProfile = (oauth2) =>
  makeClient(oauth2).get('userprofile-service/socialProfile').json();

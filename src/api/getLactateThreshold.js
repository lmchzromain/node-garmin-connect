import { makeClient } from '../utils/client.js';

/**
 * Returns the latest lactate threshold data: heart rate (BPM) and pace at threshold.
 * @param {object} oauth2 - OAuth2 token
 * @returns {Promise<object>}
 */
export const getLactateThreshold = (oauth2) =>
  makeClient(oauth2).get('biometric-service/biometric/latestLactateThreshold').json();

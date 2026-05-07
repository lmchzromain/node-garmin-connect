import { makeClient } from '../utils/client.js';

const parse = ({ userData, userSleep }) => ({
  gender: userData.gender,
  weight: userData.weight / 1000,
  height: userData.height,
  birthDate: userData.birthDate,
  vo2MaxRunning: userData.vo2MaxRunning,
  vo2MaxCycling: userData.vo2MaxCycling,
  lactateThresholdSpeed: userData.lactateThresholdSpeed,
  lactateThresholdHeartRate: userData.lactateThresholdHeartRate,
  sleepTime: userSleep?.sleepTime,
  wakeTime: userSleep?.wakeTime,
});

/**
 * Returns essential coach-relevant fields from the user's profile.
 * weight is in kg, sleepTime/wakeTime are seconds from midnight.
 * @param {object} oauth2 - OAuth2 token
 * @returns {Promise<object>}
 */
export const getUserProfile = (oauth2) =>
  makeClient(oauth2).get('userprofile-service/userprofile/user-settings').json().then(parse);

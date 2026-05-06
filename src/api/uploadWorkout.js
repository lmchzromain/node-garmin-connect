import { makeClient } from '../utils/client.js';

/**
 * Uploads a workout to Garmin Connect.
 * @param {object} oauth2 - OAuth2 token
 * @param {object} workout - Workout payload built by buildRunningWorkout()
 * @returns {Promise<{ workoutId: number }>}
 */
export const uploadWorkout = (oauth2, workout) =>
  makeClient(oauth2).post('workout-service/workout', { json: workout }).json();

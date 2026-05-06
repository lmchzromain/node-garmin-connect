import { makeClient } from '../utils/client.js';

/**
 * Schedules an existing workout on a specific calendar date.
 * @param {object} oauth2 - OAuth2 token
 * @param {number} workoutId - Workout ID returned by uploadWorkout()
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<object>}
 */
export const scheduleWorkout = (oauth2, workoutId, date) =>
  makeClient(oauth2).post(`workout-service/schedule/${workoutId}`, { json: { date } }).json();

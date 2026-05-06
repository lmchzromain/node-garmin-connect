import { getUserProfile } from './api/getUserProfile.js';
import { uploadWorkout } from './api/uploadWorkout.js';
import { scheduleWorkout } from './api/scheduleWorkout.js';
import { buildRunningWorkout } from './workout/buildWorkout.js';
import { getSocialProfile } from './api/getSocialProfile.js';
import { getTrainingStatus } from './api/getTrainingStatus.js';
import { getTrainingReadiness } from './api/getTrainingReadiness.js';
import { getHrv } from './api/getHrv.js';
import { getWeight } from './api/getWeight.js';
import { getPersonalRecords } from './api/getPersonalRecords.js';
import { getDailySummary } from './api/getDailySummary.js';
import { getDailySleep } from './api/getDailySleep.js';
import { getActivities } from './api/getActivities.js';
import { getLactateThreshold } from './api/getLactateThreshold.js';
import { getMaxMetrics } from './api/getMaxMetrics.js';

export const createClient = (oauth2) => ({
  getUserProfile: () => getUserProfile(oauth2),

  getAthleteProfile: async (date = new Date().toISOString().slice(0, 10)) => {
    const { displayName } = await getSocialProfile(oauth2);

    const [trainingStatus, trainingReadiness, hrv, weight, personalRecords, dailySummary, dailySleep, activities, lactateThreshold, maxMetrics] =
      await Promise.all([
        getTrainingStatus(oauth2, date),
        getTrainingReadiness(oauth2, date),
        getHrv(oauth2, date),
        getWeight(oauth2, date),
        getPersonalRecords(oauth2, displayName),
        getDailySummary(oauth2, displayName, date),
        getDailySleep(oauth2, displayName, date),
        getActivities(oauth2, { limit: 40 }),
        getLactateThreshold(oauth2),
        getMaxMetrics(oauth2, date),
      ]);

    return { trainingStatus, trainingReadiness, hrv, weight, personalRecords, dailySummary, dailySleep, activities, lactateThreshold, maxMetrics };
  },

  uploadRunningWorkout: async ({ name, description, steps, date }) => {
    const workout = buildRunningWorkout({ name, description, steps });
    const { workoutId } = await uploadWorkout(oauth2, workout);
    if (date) await scheduleWorkout(oauth2, workoutId, date);
    return workoutId;
  },
});

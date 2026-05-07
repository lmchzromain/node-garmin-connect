import { getUserProfile } from './api/getUserProfile.js';
import { uploadWorkout } from './api/uploadWorkout.js';
import { scheduleWorkout } from './api/scheduleWorkout.js';
import { buildRunningWorkout } from './workout/buildWorkout.js';
import { getSocialProfile } from './api/getSocialProfile.js';
import { groupByDate } from './utils/dates.js';
import { getMonthlyTrainingStatus } from './api/getMonthlyTrainingStatus.js';
import { getMonthlyTrainingReadiness } from './api/getMonthlyTrainingReadiness.js';
import { getMonthlyHrv } from './api/getMonthlyHrv.js';
import { getMonthlySleep } from './api/getMonthlySleep.js';
import { getPersonalRecords } from './api/getPersonalRecords.js';
import { getActivities } from './api/getActivities.js';


export const createClient = (oauth2) => ({
  getAthleteData: async (date = new Date().toISOString().slice(0, 10)) => {
    const { displayName } = await getSocialProfile(oauth2);

    const [userProfile, trainingStatus, trainingReadiness, hrv, sleep, personalRecords, activities] =
      await Promise.all([
        getUserProfile(oauth2),
        getMonthlyTrainingStatus(oauth2, date),
        getMonthlyTrainingReadiness(oauth2, date),
        getMonthlyHrv(oauth2, date),
        getMonthlySleep(oauth2, displayName, date),
        getPersonalRecords(oauth2, displayName),
        getActivities(oauth2, { limit: 40 }),
      ]);

    const daily = groupByDate(
      ['trainingStatus', 'trainingReadiness', 'hrv', 'sleep'],
      trainingStatus, trainingReadiness, hrv, sleep,
    );

    return { userProfile, daily, personalRecords, activities };
  },

  uploadRunningWorkout: async ({ name, description, steps, date }) => {
    const workout = buildRunningWorkout({ name, description, steps });
    const { workoutId } = await uploadWorkout(oauth2, workout);
    if (date) await scheduleWorkout(oauth2, workoutId, date);
    return workoutId;
  },
});

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

const today = () => new Date().toISOString().slice(0, 10);

const daysAgo = (n, from = today()) => {
  const d = new Date(from);
  d.setDate(d.getDate() - n + 1);
  return d.toISOString().slice(0, 10);
};

const daysBetween = (startDate, endDate) =>
  Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1;

const avg = (arr) => {
  const vals = arr.filter(Boolean);
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : undefined;
};

export const createClient = (oauth2) => ({
  getAthleteData: async ({ startDate, endDate = today() } = {}) => {
    const start = startDate ?? daysAgo(30, endDate);
    const days = daysBetween(start, endDate);

    const { displayName } = await getSocialProfile(oauth2);
    const [userProfile, personalRecords, hrv, sleep] = await Promise.all([
      getUserProfile(oauth2),
      getPersonalRecords(oauth2, displayName),
      getMonthlyHrv(oauth2, endDate, days),
      getMonthlySleep(oauth2, displayName, endDate, days),
    ]);

    const lastHrv = [...hrv].reverse().find((d) => d.weeklyAvg);

    return {
      userProfile: {
        ...userProfile,
        restingHR: avg(sleep.map((d) => d.restingHR)),
        hrv: {
          weeklyAvg: lastHrv?.weeklyAvg,
          baseline: lastHrv?.baseline,
          status: lastHrv?.status,
        },
        sleep: {
          avgDuration: avg(sleep.map((d) => d.duration)),
          avgScore: avg(sleep.map((d) => d.score)),
        },
      },
      personalRecords,
    };
  },

  getHealthData: async ({ startDate, endDate = today() } = {}) => {
    const start = startDate ?? daysAgo(30, endDate);
    const days = daysBetween(start, endDate);

    const { displayName } = await getSocialProfile(oauth2);
    const [trainingStatus, trainingReadiness, hrv, sleep] = await Promise.all([
      getMonthlyTrainingStatus(oauth2, endDate, days),
      getMonthlyTrainingReadiness(oauth2, endDate, days),
      getMonthlyHrv(oauth2, endDate, days),
      getMonthlySleep(oauth2, displayName, endDate, days),
    ]);

    const daily = groupByDate(
      ['trainingStatus', 'trainingReadiness', 'hrv', 'sleep'],
      trainingStatus, trainingReadiness, hrv, sleep,
    );

    return { daily };
  },

  getActivities: ({ startDate, endDate, limit } = {}) =>
    getActivities(oauth2, { startDate, endDate, limit }),

  uploadRunningWorkout: async ({ name, description, steps, date }) => {
    const workout = buildRunningWorkout({ name, description, steps });
    const { workoutId } = await uploadWorkout(oauth2, workout);
    if (date) await scheduleWorkout(oauth2, workoutId, date);
    return workoutId;
  },
});

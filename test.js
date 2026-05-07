import 'dotenv/config';
import { writeFile } from 'fs/promises';
import { GarminConnect } from './index.js';
import { warmup, cooldown, interval, recovery, repeat } from './src/workout/steps.js';

const { GARMIN_EMAIL, GARMIN_PASSWORD } = process.env;

const garminConnect = await GarminConnect(GARMIN_EMAIL, GARMIN_PASSWORD);

const athleteData = await garminConnect.getAthleteData();
const healthData = await garminConnect.getHealthData({ startDate: '2026-04-07', endDate: '2026-05-07' });
const activities = await garminConnect.getActivities({ startDate: '2026-04-07', endDate: '2026-05-07' });

// await garminConnect.uploadRunningWorkout({
//   name: 'test workout',
//   date: '2026-05-07',
//   steps: [
//     warmup({ duration: 600, pace: { min: '5:30', max: '6:00' } }),
//     repeat({
//       iterations: 5,
//       steps: [
//         interval({ distance: 1000, pace: '4:00' }),
//         recovery({ duration: 90, pace: { min: '5:30', max: '6:00' } }),
//       ],
//     }),
//     interval({ distance: 1000, pace: { min: '4:00', max: '4:30' } }),
//     interval({ distance: 1000, hr: 150 }),
//     interval({ distance: 1000, hr: { max: 180 } }),

//     cooldown({ duration: 300, pace: { min: '5:30', max: '6:00' } }),
//   ],
// });

await writeFile('garmin_athlete.json', JSON.stringify(athleteData, null, 2));
await writeFile('garmin_health.json', JSON.stringify(healthData, null, 2));
await writeFile('garmin_activities.json', JSON.stringify(activities, null, 2));

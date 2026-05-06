import 'dotenv/config';
import { GarminConnect } from './index.js';

const { GARMIN_EMAIL, GARMIN_PASSWORD } = process.env;

const garminConnect = await GarminConnect(GARMIN_EMAIL, GARMIN_PASSWORD);

const profile = await garminConnect.getUserProfile();
console.log('User profile:', profile);

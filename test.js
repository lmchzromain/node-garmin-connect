import 'dotenv/config';
import { GarminConnect } from './index.js';

const { GARMIN_EMAIL, GARMIN_PASSWORD } = process.env;

GarminConnect(GARMIN_EMAIL, GARMIN_PASSWORD)
  .then(() => console.log('Successfully connected to Garmin Connect'))
  .catch((err) => console.error('Connection failed:', err.message));

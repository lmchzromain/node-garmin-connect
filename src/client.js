import { getUserProfile } from './api/user.js';

export const createClient = (oauth2) => ({
  getUserProfile: () => getUserProfile(oauth2),
});

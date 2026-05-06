import { makeClient } from '../utils/client.js';

export const getUserProfile = (oauth2) =>
  makeClient(oauth2).get('userprofile-service/userprofile/user-settings').json();

import got from 'got';

const BASE_URL = 'https://connectapi.garmin.com';

export const makeClient = (oauth2) =>
  got.extend({
    prefixUrl: BASE_URL,
    headers: {
      Authorization: `Bearer ${oauth2.access_token}`,
      Accept: 'application/json',
    },
  });

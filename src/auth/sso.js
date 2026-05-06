const SSO_EMBED_URL = 'https://sso.garmin.com/sso/embed';
const SSO_SIGNIN_URL = 'https://sso.garmin.com/sso/signin';

const SSO_PARAMS = {
  id: 'gauth-widget',
  embedWidget: 'true',
  clientId: 'GarminConnect',
  locale: 'en',
  gauthHost: SSO_EMBED_URL,
  service: SSO_EMBED_URL,
  source: SSO_EMBED_URL,
  redirectAfterAccountLoginUrl: SSO_EMBED_URL,
  redirectAfterAccountCreationUrl: SSO_EMBED_URL,
};

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  Connection: 'keep-alive',
  dnt: '1',
};

export const initCookies = (client) =>
  client.get(SSO_EMBED_URL, {
    searchParams: { clientId: 'GarminConnect', locale: 'en', service: 'https://connect.garmin.com/modern' },
    headers: BROWSER_HEADERS,
  });

export const fetchCsrfToken = async (client) => {
  const response = await client.get(SSO_SIGNIN_URL, {
    searchParams: SSO_PARAMS,
    headers: BROWSER_HEADERS,
  });
  const match = response.body.match(/name="_csrf"\s+value="(.+?)"/);
  if (!match) throw new Error('CSRF token not found in login page');
  return match[1];
};

export const submitCredentials = async (client, username, password, csrfToken) => {
  const response = await client.post(SSO_SIGNIN_URL, {
    searchParams: SSO_PARAMS,
    headers: {
      ...BROWSER_HEADERS,
      Origin: 'https://sso.garmin.com',
      Referer: `${SSO_SIGNIN_URL}?${new URLSearchParams(SSO_PARAMS)}`,
    },
    form: { username, password, embed: 'true', _csrf: csrfToken },
  });
  const match = response.body.match(/ticket=([^"&]+)/);
  if (!match) throw new Error('Login failed: no ticket returned (wrong credentials?)');
  return match[1];
};

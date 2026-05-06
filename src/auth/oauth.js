import crypto from 'crypto';
import got from 'got';
import OAuth from 'oauth-1.0a';

const CONSUMER_URL = 'https://thegarth.s3.amazonaws.com/oauth_consumer.json';
const PREAUTH_URL = 'https://connectapi.garmin.com/oauth-service/oauth/preauthorized';
const EXCHANGE_URL = 'https://connectapi.garmin.com/oauth-service/oauth/exchange/user/2.0';
const MOBILE_USER_AGENT = 'com.garmin.android.apps.connectmobile';

export const fetchConsumerCredentials = () => got.get(CONSUMER_URL).json();

const createOauth = (consumer) =>
  new OAuth({
    consumer: { key: consumer.consumer_key, secret: consumer.consumer_secret },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) =>
      crypto.createHmac('sha1', key).update(baseString).digest('base64'),
  });

const oauthHeader = (oauth, request, token = null) =>
  oauth.toHeader(oauth.authorize(request, token));

export const fetchOauth1Token = async (ticket, consumer) => {
  const searchParams = {
    ticket,
    'login-url': 'https://sso.garmin.com/sso/embed',
    'accepts-mfa-tokens': 'true',
  };
  const oauth = createOauth(consumer);
  const fullUrl = `${PREAUTH_URL}?${new URLSearchParams(searchParams)}`;
  const headers = {
    ...oauthHeader(oauth, { url: fullUrl, method: 'GET' }),
    'User-Agent': MOBILE_USER_AGENT,
  };

  const response = await got.get(PREAUTH_URL, { searchParams, headers });
  const parsed = new URLSearchParams(response.body);
  return {
    oauth_token: parsed.get('oauth_token'),
    oauth_token_secret: parsed.get('oauth_token_secret'),
  };
};

export const exchangeForOauth2Token = (oauth1Token, consumer) => {
  const oauth = createOauth(consumer);
  const token = { key: oauth1Token.oauth_token, secret: oauth1Token.oauth_token_secret };
  const headers = {
    ...oauthHeader(oauth, { url: EXCHANGE_URL, method: 'POST' }, token),
    'User-Agent': MOBILE_USER_AGENT,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  return got.post(EXCHANGE_URL, { headers }).json();
};

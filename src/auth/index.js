import got from 'got';
import { CookieJar } from 'tough-cookie';
import { initCookies, fetchCsrfToken, submitCredentials } from './sso.js';
import { fetchConsumerCredentials, fetchOauth1Token, exchangeForOauth2Token } from './oauth.js';
import {
  DEFAULT_TOKENS_PATH,
  readTokens,
  writeTokens,
  isOauth2Valid,
  withExpiry,
} from './tokens.js';

const fullLogin = async (username, password) => {
  const cookieJar = new CookieJar();
  const client = got.extend({ cookieJar });

  await initCookies(client);
  const csrfToken = await fetchCsrfToken(client);
  const ticket = await submitCredentials(client, username, password, csrfToken);
  const consumer = await fetchConsumerCredentials();
  const oauth1 = await fetchOauth1Token(ticket, consumer);
  const oauth2 = withExpiry(await exchangeForOauth2Token(oauth1, consumer));

  return { oauth1, oauth2 };
};

const refreshOauth2 = async (oauth1) => {
  const consumer = await fetchConsumerCredentials();
  const oauth2 = withExpiry(await exchangeForOauth2Token(oauth1, consumer));
  return oauth2;
};

export const login = async (username, password, { tokensPath = DEFAULT_TOKENS_PATH } = {}) => {
  const existing = await readTokens(tokensPath);

  if (existing) {
    if (isOauth2Valid(existing.oauth2)) return existing;

    try {
      const oauth2 = await refreshOauth2(existing.oauth1);
      const tokens = { ...existing, oauth2 };
      await writeTokens(tokens, tokensPath);
      return tokens;
    } catch {
      // fall through to full login
    }
  }

  const tokens = await fullLogin(username, password);
  await writeTokens(tokens, tokensPath);
  return tokens;
};

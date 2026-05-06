import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

export const DEFAULT_TOKENS_PATH = '.garmin-tokens.json';

export const readTokens = async (filePath) => {
  try {
    return JSON.parse(await readFile(filePath, 'utf-8'));
  } catch {
    return null;
  }
};

export const writeTokens = async (tokens, filePath) => {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(tokens, null, 2));
};

// 60s buffer to avoid using a token that expires mid-request
export const isOauth2Valid = (oauth2) =>
  Boolean(oauth2?.access_token) && Date.now() < oauth2.expires_at - 60_000;

export const withExpiry = (oauth2) => ({
  ...oauth2,
  expires_at: Date.now() + oauth2.expires_in * 1000,
});

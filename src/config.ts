interface Config {
  assetDbUrl: URL;
}

export function readConfigFromEnv(): Config {
  if (!process.env.ASSET_DB_URL) {
    throw new Error('ASSET_DB_URL environment variable is required');
  }
  return {
    assetDbUrl: new URL(process.env.ASSET_DB_URL)
  };
}

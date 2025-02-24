import nano from 'nano';
import { Asset } from '../model/asset';

let db: nano.DocumentScope<Asset> | undefined;

export async function connect(dbUrl: URL) {
  if (!db) {
    const client = nano(new URL('/', dbUrl).toString());
    const dbName = dbUrl.pathname.slice(1);
    db = client.use<Asset>(dbName);
  }
  return db;
}

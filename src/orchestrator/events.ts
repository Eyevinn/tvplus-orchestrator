import { Context } from '@osaas/client-core';
import { createVod } from '@osaas/client-transcode';
import { Asset } from '../model/asset';
import { readConfigFromEnv } from '../config';
import { connect } from './db';

export async function onFileOnInput(record: any, pipeline: any, ctx: Context) {
  const config = readConfigFromEnv();
  const db = await connect(config.assetDbUrl);
  console.log('Received file on input storage', record);
  const sourceUrl = new URL(
    `s3://${record.s3.bucket.name}/${record.s3.object.key}`
  );
  const vod = await createVod(pipeline, sourceUrl.toString(), ctx);
  console.log(vod);
  const asset: Asset = {
    assetId: vod.id,
    vodUrl: vod.vodUrl
  };
  await db.insert(asset);
  console.log('Asset saved to database');
}

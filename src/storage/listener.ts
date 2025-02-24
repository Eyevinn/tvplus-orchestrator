import { Context } from '@osaas/client-core';
import * as Minio from 'minio';

export async function setupListener(
  bucketName: string,
  endpoint: URL,
  accessKeyId: string,
  secretAccessKey: string,
  pipeline: any,
  ctx: Context,
  onNotification: (r: any, pipeline: any, ctx: Context) => Promise<void>
) {
  const client = new Minio.Client({
    endPoint: endpoint.hostname,
    accessKey: accessKeyId,
    secretKey: secretAccessKey,
    useSSL: endpoint.protocol === 'https:'
  });
  const poller = client.listenBucketNotification(bucketName, '', '.mp4', [
    's3:ObjectCreated:*'
  ]);
  if (!poller) {
    console.error('Failed to setup listener for bucket notifications');
  }
  console.log('Listening for notifications');
  poller.on('notification', async (record) => {
    await onNotification(record, pipeline, ctx);
    poller.stop();
  });
}

import { Context } from '@osaas/client-core';
import { createVodPipeline, removeVodPipeline } from '@osaas/client-transcode';
import { Type } from '@sinclair/typebox';
import { FastifyPluginCallback } from 'fastify';
import { setupListener } from './storage/listener';

export interface PipelineOptions {
  name: string;
  ctx: Context;
  onFileOnInput: (r: any, pipeline: any) => Promise<void>;
}

export const apiPipeline: FastifyPluginCallback<PipelineOptions> = (
  fastify,
  opts,
  next
) => {
  fastify.post<{ Reply: { message: string } }>(
    '/pipeline',
    {
      schema: {
        description: 'Setup video pipeline',
        response: {
          201: { message: Type.String() },
          500: { message: Type.String() }
        }
      }
    },
    async (request, reply) => {
      try {
        const pipeline = await createVodPipeline(opts.name, opts.ctx, {
          createInputBucket: true
        });
        if (pipeline.inputStorage) {
          setupListener(
            pipeline.inputStorage.name,
            new URL(pipeline.inputStorage.endpoint),
            pipeline.inputStorage.accessKeyId,
            pipeline.inputStorage.secretAccessKey,
            pipeline,
            opts.onFileOnInput
          );
        } else {
          throw new Error('Pipeline has no input storage');
        }
        reply.status(201).send({ message: 'Pipeline created' });
      } catch (err: any) {
        reply.status(500).send({ message: err.message });
      }
    }
  );

  fastify.delete<{ Reply: { message: string } }>(
    '/pipeline',
    {
      schema: {
        description: 'Remove video pipeline',
        response: {
          200: { message: Type.String() },
          500: { message: Type.String() }
        }
      }
    },
    async (request, reply) => {
      try {
        await removeVodPipeline(opts.name, opts.ctx);
        reply.status(200).send({ message: 'Pipeline removed' });
      } catch (err: any) {
        reply.status(500).send({ message: err.message });
      }
    }
  );
  next();
};

import { Context } from '@osaas/client-core';
import { createVodPipeline, removeVodPipeline } from '@osaas/client-transcode';
import { Type } from '@sinclair/typebox';
import { FastifyPluginCallback } from 'fastify';

export interface PipelineOptions {
  name: string;
  ctx: Context;
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
        await createVodPipeline(opts.name, opts.ctx, {
          createInputBucket: true
        });
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

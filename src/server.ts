import { Context } from '@osaas/client-core';
import api from './api';

const ctx = new Context();
const server = api({
  title: 'tvplus-orchestrator',
  ctx
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

server.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    throw err;
  }
  console.log(`Server listening on ${address}`);
});

export default server;

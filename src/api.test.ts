import api from './api';
import { Context } from '@osaas/client-core';
jest.mock('@osaas/client-core');

describe('api', () => {
  it('responds with hello, world!', async () => {
    const server = api({
      title: 'my awesome service',
      ctx: new Context()
    });
    const response = await server.inject({
      method: 'GET',
      url: '/'
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe('Hello, world! I am my awesome service');
  });
});

import { HttpMiddleware } from './http.middleware';

describe('HttpMiddleware', () => {
  it('should be defined', () => {
    expect(new HttpMiddleware()).toBeDefined();
  });
});

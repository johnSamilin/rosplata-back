import { EarlyHintsMiddleware } from './early-hints.middleware';

describe('EarlyHintsMiddleware', () => {
  it('should be defined', () => {
    expect(new EarlyHintsMiddleware()).toBeDefined();
  });
});

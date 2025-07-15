import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { createMock } from '@golevelup/ts-jest';
import { LoggerService } from '../../logger.service';

describe('AuthGuard', () => {
  const authGuard = new AuthGuard(new LoggerService());

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it("should return true if there's a valid API key", () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          header: () => 'SECRET_SAUCE',
          headers: {
            'x-api-key': 'SECRET_SAUCE',
          },
        }),
      }),
    });
    const result = authGuard.canActivate(context);
    expect(result).toBe(true);
  });

  it("should return false if there's no header passed in", () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({ header: undefined, headers: undefined }),
      }),
    });
    const result = authGuard.canActivate(context);
    expect(result).toBeFalsy();
  });

  it('should return false if the API KEY is invalid', () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          header: () => 'SECRET_WRONG',
          headers: { 'x-api-key': 'SECRET_WRONG' },
        }),
      }),
    });
    const result = authGuard.canActivate(context);
    expect(result).toBeFalsy();
  });
});

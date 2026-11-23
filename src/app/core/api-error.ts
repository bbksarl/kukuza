export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly payload?: unknown,
    readonly correlationId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

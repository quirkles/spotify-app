export * from "./axiosError";

interface BaseError {
  statusCode: number;
}

export class UnauthorizedError extends Error implements BaseError {
  statusCode = 401;
  name = "UnauthorizedError";
  constructor(message: string) {
    super(message);
  }
}

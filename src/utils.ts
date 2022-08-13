export function getRandomElementFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomIntegerInRange(x: number, y: number): number {
  const min = Math.floor(Math.min(x, y));
  const max = Math.ceil(Math.max(x, y));
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomSampleOfArray<T>(arr: T[], n: number): T[] {
  if (n >= arr.length) {
    return arr;
  }

  const sample = [];
  let source = [...arr];
  while (sample.length < n) {
    const index = getRandomIntegerInRange(0, source.length - 1);
    sample.push(source[index]);
    source = [...source.slice(0, index), ...source.slice(index + 1)];
  }
  return sample;
}

export function asyncRetry<T, U extends unknown[]>(
  fn: (...args: U) => Promise<T>,
  options?: {
    retries?: number;
    onFail?: (err: Error) => void;
    thisArg: ThisType<unknown>;
  }
): (...args: U) => Promise<T> {
  const errors: Error[] = [];
  let result: T;
  let resolved = false;
  const defaultRetries = 5;
  let { retries = defaultRetries } = options || {};
  const { onFail = () => null, thisArg = null } = options || {};
  return async function (...args: U): Promise<T> {
    while (retries > 0 && !resolved) {
      retries--;
      try {
        result = await fn.call(thisArg, ...args);
        resolved = true;
      } catch (e) {
        onFail(e as Error);
        errors.push(e as Error);
      }
    }
    if (resolved) {
      return Promise.resolve(result);
    }
    const error: Error & {
      errors?: string[];
    } = new Error(
      `Failed to resolve fn after ${
        options?.retries || defaultRetries
      } retries.`
    );
    error.errors = errors.map((e) => e.message);
    return Promise.reject(error);
  };
}

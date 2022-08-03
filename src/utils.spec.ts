import { asyncRetry, getRandomSampleOfArray } from "./utils";

describe("utils", () => {
  describe("getRandomSampleOfArray", () => {
    it("works as expected", () => {
      expect.assertions(600);
      let testCases = 100;
      const input = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      while (testCases > 0) {
        const sample = getRandomSampleOfArray(input, 4);
        expect(sample.length).toBe(4);
        for (const i of sample) {
          expect(input.includes(i)).toBe(true);
        }
        expect(new Set(sample).size).toBe(4);
        testCases--;
      }
    });
  });
  describe("asyncRetry", () => {
    it("will eventually resolve to the return value of the function", async () => {
      let fails = 0;
      const onFail = jest.fn();
      const mockedAsyncFn = jest.fn(() => {
        if (fails < 4) {
          fails++;
          return Promise.reject(new Error(`Failure ${fails}`));
        }
        return Promise.resolve("Good this time!");
      });
      const retry = asyncRetry(mockedAsyncFn, { retries: 5, onFail });

      const finalReturn = await retry();

      expect(finalReturn).toBe("Good this time!");
      expect(onFail).toHaveBeenCalledTimes(4);
    });
    it("will eventually reject with an error containing an additional errors array", async () => {
      let fails = 0;
      const onFail = jest.fn();
      const mockedAsyncFn = jest.fn(() => {
        if (fails < 10) {
          fails++;
          return Promise.reject(new Error(`Failure ${fails}`));
        }
        return Promise.resolve("Good this time!");
      });
      const retry = asyncRetry(mockedAsyncFn, { retries: 5, onFail });

      let err;
      try {
        await retry();
      } catch (e) {
        err = e;
      }
      expect((err as Error & { errors: string[] }).errors).toEqual([
        "Failure 1",
        "Failure 2",
        "Failure 3",
        "Failure 4",
        "Failure 5",
      ]);
    });
    it("honors the call signature of the retried function", async () => {
      let fails = 0;
      const asyncMultiply = (x: number, y: number): Promise<number> => {
        if (fails < 4) {
          fails++;
          return Promise.reject(new Error(`Failure ${fails}`));
        }
        return Promise.resolve(x * y);
      };
      const retry = asyncRetry(asyncMultiply, { retries: 5 });

      const result = await retry(8, 7);
      expect(result).toBe(56);
    });
  });
});

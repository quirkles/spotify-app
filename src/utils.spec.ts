import { getRandomSampleOfArray } from "./utils";

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
});

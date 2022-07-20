import { UserSessionDataKindRepository } from "./userSessionData";

describe("user session data repo", () => {
  it("should gets by key correctly", async function () {
    expect.assertions(2);
    const mockDatastore = {
      key: jest.fn((i) => i),
      get: jest.fn((i) => Promise.resolve(i)),
    };

    const mockLogger = {};

    const repo = new UserSessionDataKindRepository(
      mockDatastore as any,
      mockLogger as any
    );

    await repo.getByKey("abc");

    expect(mockDatastore.key).toHaveBeenCalledWith([
      "UserSessionDataKind",
      "abc",
    ]);
    expect(mockDatastore.get).toHaveBeenCalledWith([
      "UserSessionDataKind",
      "abc",
    ]);
  });
});

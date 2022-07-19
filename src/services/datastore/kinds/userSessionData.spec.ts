import { UserSessionDataKind } from "./userSessionData";

describe("UserSessionDataKind model", () => {
  it("should generate the expected entity", function () {
    const model = new UserSessionDataKind({
      userSpotifyId: "userSpotifyId",
      refreshToken: "refreshToken",
    });
    expect(model.entity).toEqual({
      data: {
        refreshToken: "refreshToken",
        userSpotifyId: "userSpotifyId",
      },
      keyPair: ["UserSessionData", "userSpotifyId"],
    });
  });
});

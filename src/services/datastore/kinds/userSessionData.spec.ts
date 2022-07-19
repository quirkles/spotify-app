import { UserSessionData } from "./userSessionData";

describe("UserSessionData model", () => {
  it("should generate the expected entity", function () {
    const model = new UserSessionData({
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

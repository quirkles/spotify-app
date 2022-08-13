import { Event, EventBus } from "./index";
import { Logger } from "winston";

describe("EventBus", () => {
  it("logs events", () => {
    const logger = {
      debug: jest.fn(),
    };
    const eventBus = new EventBus(logger as unknown as Logger);
    let token1 = "";
    let token2 = "";
    eventBus.on(
      Event.AccessTokenUpdated,
      (payload) => (token1 = payload.newAccessToken)
    );
    eventBus.on(
      Event.AccessTokenUpdated,
      (payload) => (token2 = payload.newAccessToken)
    );
    eventBus.emit(Event.AccessTokenUpdated, { newAccessToken: "new-token" });

    expect(token1).toBe("new-token");
    expect(token2).toBe("new-token");
    expect(logger.debug).toHaveBeenCalledTimes(1);
    expect(logger.debug).toHaveBeenCalledWith(Event.AccessTokenUpdated, {
      newAccessToken: "new-token",
    });
  });
});

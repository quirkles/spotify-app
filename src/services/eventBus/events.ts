export enum Event {
  AccessTokenUpdated = "AccessTokenUpdated",
}

export interface EventPayloads {
  [Event.AccessTokenUpdated]: {
    newAccessToken: string;
  };
}

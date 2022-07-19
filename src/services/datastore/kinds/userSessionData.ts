import { BaseKind } from "./base";

export interface IUserSessionData extends Record<string, string | Date | number | undefined> {
  userSpotifyId: string;
  refreshToken?: string;
  accessToken?: string;
  accessTokenExpiryDateTime?: Date;
}

export class UserSessionDataKind extends BaseKind<IUserSessionData> {
  constructor(data: IUserSessionData) {
    super(data, "userSpotifyId");
  }
}

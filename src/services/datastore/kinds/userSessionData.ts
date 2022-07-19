import { BaseKind } from "./base";

export interface IUserSessionData extends Record<string, any> {
  userSpotifyId: string;
  refreshToken?: string;
  accessToken?: string;
  accessTokenExpiryDateTime?: Date;
}

export class UserSessionData extends BaseKind<IUserSessionData> {
  constructor(data: IUserSessionData) {
    super(data, "userSpotifyId");
  }
}

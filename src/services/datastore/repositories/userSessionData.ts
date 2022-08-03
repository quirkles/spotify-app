import { UserSessionDataKind } from "../kinds";
import { BaseRepository } from "./base";
import { asyncRetry } from "../../../utils";

export class UserSessionDataKindRepository extends BaseRepository<UserSessionDataKind> {
  async setRefreshToken(
    userSpotifyId: string,
    refreshToken: string
  ): Promise<UserSessionDataKind> {
    this.logger.debug("Setting refresh token", {
      userSpotifyId,
      refreshToken: `${refreshToken.substring(0, 20)}...`,
    });
    return asyncRetry(this.update)(
      new UserSessionDataKind({ userSpotifyId, refreshToken })
    );
  }

  async setAccessToken(
    userSpotifyId: string,
    accessToken: string
  ): Promise<UserSessionDataKind> {
    this.logger.debug("Setting access token", {
      userSpotifyId,
      accessToken: `${accessToken.substring(0, 20)}...`,
    });
    return asyncRetry(this.update)(
      new UserSessionDataKind({ userSpotifyId, accessToken })
    );
  }

  async setExpiryDate(
    userSpotifyId: string,
    date: Date
  ): Promise<UserSessionDataKind> {
    this.logger.debug("Setting expiry date", { userSpotifyId, date });

    return asyncRetry(this.update)(
      new UserSessionDataKind({ userSpotifyId, date })
    );
  }
}

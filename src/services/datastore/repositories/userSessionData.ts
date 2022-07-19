import { UserSessionDataKind } from "../kinds";
import { BaseRepository } from "./base";

export class UserSessionDataKindRepository extends BaseRepository<UserSessionDataKind> {
  async setRefreshToken(
    userSpotifyId: string,
    refreshToken: string
  ): Promise<UserSessionDataKind> {
    this.logger.debug("Setting refresh token", {
      userSpotifyId,
      refreshToken: `${refreshToken.substring(0, 20)}...`,
    });
    return this.save(new UserSessionDataKind({ userSpotifyId, refreshToken }));
  }

  async setAccessToken(
    userSpotifyId: string,
    accessToken: string
  ): Promise<UserSessionDataKind> {
    this.logger.debug("Setting access token", {
      userSpotifyId,
      accessToken: `${accessToken.substring(0, 20)}...`,
    });
    return this.save(new UserSessionDataKind({ userSpotifyId, accessToken }));
  }

  async setExpiryDate(
    userSpotifyId: string,
    date: Date
  ): Promise<UserSessionDataKind> {
    this.logger.debug("Setting expiry date", { userSpotifyId, date });

    return this.save(new UserSessionDataKind({ userSpotifyId, date }));
  }
}

import { BaseRepository } from "./index";
import { UserSessionData } from "../kinds";

export class UserSessionDataRepository extends BaseRepository<UserSessionData> {
  async setRefreshToken(
    userSpotifyId: string,
    refreshToken: string
  ): Promise<UserSessionData> {
    this.logger.debug("Setting refresh token", {
      userSpotifyId,
      refreshToken: `${refreshToken.substring(0, 20)}...`,
    });
    return this.save(new UserSessionData({ userSpotifyId, refreshToken }));
  }

  async setAccessToken(
    userSpotifyId: string,
    accessToken: string
  ): Promise<UserSessionData> {
    this.logger.debug("Setting access token", {
      userSpotifyId,
      accessToken: `${accessToken.substring(0, 20)}...`,
    });
    return this.save(new UserSessionData({ userSpotifyId, accessToken }));
  }

  async setExpiryDate(
    userSpotifyId: string,
    date: Date
  ): Promise<UserSessionData> {
    this.logger.debug("Setting expiry date", { userSpotifyId, date });

    return this.save(new UserSessionData({ userSpotifyId, date }));
  }
}

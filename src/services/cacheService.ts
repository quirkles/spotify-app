import { createClient, RedisClientType } from "redis";

import { CONFIG } from "../config";

const { redisHost, redisPort, redisPassword } = CONFIG;

const redisUrl = `redis://:${redisPassword}@${redisHost}:${redisPort}`;

interface CacheEntity {
  userSpotifyId?: string;
  refreshToken?: string;
  accessToken?: string;
  accessTokenExpiryDateTime?: Date;
}

export class CacheService {
  private readonly redisClient: RedisClientType;
  constructor() {
    this.redisClient = createClient({
      url: redisUrl,
      socket: {
        keepAlive: 600000,
      },
    });
  }

  async setRefreshToken(
    userSpotifyId: string,
    refreshToken: string
  ): Promise<number> {
    if (!this.redisClient.isOpen) {
      await this.redisClient.connect();
    }
    return this.redisClient.hSet(userSpotifyId, "refreshToken", refreshToken);
  }
  async setAccessToken(
    userSpotifyId: string,
    accessToken: string
  ): Promise<number> {
    if (!this.redisClient.isOpen) {
      await this.redisClient.connect();
    }
    return this.redisClient.hSet(userSpotifyId, "accessToken", accessToken);
  }
  async setExpiryDate(userSpotifyId: string, date: Date): Promise<number> {
    if (!this.redisClient.isOpen) {
      await this.redisClient.connect();
    }
    const dateStr = date.getTime().toString();
    return this.redisClient.hSet(
      userSpotifyId,
      "accessTokenExpiryDateTime",
      dateStr
    );
  }
  async getCacheValue(userSpotifyId: string): Promise<CacheEntity | null> {
    if (!this.redisClient.isOpen) {
      await this.redisClient.connect();
    }
    return this.redisClient.hGetAll(userSpotifyId).then(
      (
        entity:
          | {
              refreshToken?: string;
              accessToken?: string;
              accessTokenExpiryDateTime?: string;
            }
          | undefined
      ) => {
        if (!entity) {
          return null;
        }
        const { refreshToken, accessTokenExpiryDateTime, accessToken } = entity;
        const returnEntity: CacheEntity = { userSpotifyId };
        if (refreshToken) {
          returnEntity.refreshToken = refreshToken;
        }
        if (accessToken) {
          returnEntity.accessToken = accessToken;
        }
        if (accessTokenExpiryDateTime) {
          returnEntity.accessTokenExpiryDateTime = new Date(
            parseInt(accessTokenExpiryDateTime, 10)
          );
        }
        return returnEntity;
      }
    );
  }
}

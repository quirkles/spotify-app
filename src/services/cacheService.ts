import { createClient, RedisClientType } from "redis";

import { CONFIG } from "../config";
import { Logger } from "winston";

const { redisHost, redisPort } = CONFIG;

const redisUrl = `redis://${redisHost}:${redisPort}`;

interface CacheEntity {
  userSpotifyId?: string;
  refreshToken?: string;
  accessToken?: string;
  accessTokenExpiryDateTime?: Date;
}

export class CacheService {
  private readonly redisClient: RedisClientType;
  private logger: Logger;
  constructor(logger: Logger) {
    this.logger = logger;
    this.logger.debug("Creating cache client", { redisUrl });
    this.redisClient = createClient({
      url: redisUrl,
      socket: {
        keepAlive: 600000,
      },
    });
    this.logger.debug("Created ok!");
  }

  async setRefreshToken(
    userSpotifyId: string,
    refreshToken: string
  ): Promise<number> {
    this.logger.debug("Setting refresh token", {
      userSpotifyId,
      refreshToken: `${refreshToken.substring(0, 20)}...`,
    });
    if (!this.redisClient.isOpen) {
      try {
        this.logger.debug("connecting to redis");
        await this.redisClient.connect();
        this.logger.debug("connected!");
      } catch (err) {
        this.logger.debug("failed to connect", { error: err });
      }
    }
    return this.redisClient.hSet(userSpotifyId, "refreshToken", refreshToken);
  }
  async setAccessToken(
    userSpotifyId: string,
    accessToken: string
  ): Promise<number> {
    this.logger.debug("Setting access token", {
      userSpotifyId,
      accessToken: `${accessToken.substring(0, 20)}...`,
    });
    if (!this.redisClient.isOpen) {
      try {
        this.logger.debug("connecting to redis");
        await this.redisClient.connect();
        this.logger.debug("connected!");
      } catch (err) {
        this.logger.debug("failed to connect", { error: err });
      }
    }
    return this.redisClient.hSet(userSpotifyId, "accessToken", accessToken);
  }
  async setExpiryDate(userSpotifyId: string, date: Date): Promise<number> {
    this.logger.debug("Setting expiry date", { userSpotifyId, date });
    if (!this.redisClient.isOpen) {
      try {
        this.logger.debug("connecting to redis");
        await this.redisClient.connect();
        this.logger.debug("connected!");
      } catch (err) {
        this.logger.debug("failed to connect", { error: err });
      }
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

interface Config {
  port: number;
  environment: string;
  redirectUri: string;
  scope: string;
  spotifyStateKey: string;
  redisHost: string;
  redisPort: string;
  frontEndHost: string;
}

export const CONFIG: Config = {
  port: parseInt(process.env.PORT || "3030", 10),
  environment: process.env.environment || "development",
  redirectUri:
    process.env.REDIRECT_URI || "http://localhost:3030/oauth_callback",
  scope: "user-read-private user-read-email",
  spotifyStateKey: "spotify_auth_state",
  redisHost: process.env.REDIS_HOST || "127.0.0.1",
  redisPort: process.env.REDIS_PORT || "6379",
  frontEndHost: process.env.FRONT_END_HOST || "http://localhost:4200",
};

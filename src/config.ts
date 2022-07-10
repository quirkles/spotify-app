interface Config {
  port: number;
  environment: string;
  redirectUri: string;
  scope: string;
  spotifyStateKey: string;
  redisHost: string;
  redisPort: string;
  redisPassword: string;
  frontEndHost: string;
}

export const CONFIG: Config = {
  port: parseInt(process.env.PORT || "3030", 10),
  environment: process.env.environment || "development",
  redirectUri:
    process.env.redirectUri || "http://localhost:3030/oauth_callback",
  scope: "user-read-private user-read-email",
  spotifyStateKey: "spotify_auth_state",
  redisHost: process.env.redisHost || "127.0.0.1",
  redisPort: process.env.redisPort || "6379",
  redisPassword: process.env.redisPassword || "abcdefg",
  frontEndHost: process.env.redisPassword || "http://localhost:4200",
};

interface Config {
  port: number;
  environment: string;
  redirectUri: string;
  scope: string;
  spotifyStateKey: string;
  frontEndHost: string;
  postgresHost: string;
  postgresPort: string;
}

export const CONFIG: Config = {
  port: parseInt(process.env.PORT || "3030", 10),
  environment: process.env.environment || "development",
  redirectUri:
    process.env.REDIRECT_URI || "http://localhost:3030/oauth_callback",
  scope: "user-read-private user-read-email user-top-read",
  spotifyStateKey: "spotify_auth_state",
  frontEndHost: process.env.FRONT_END_HOST || "http://localhost:4000",
  postgresHost: process.env.PG_HOST || "localhost",
  postgresPort: process.env.PG_PORT || "5432",
};

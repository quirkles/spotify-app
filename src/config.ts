export const CONFIG = {
  port: process.env.PORT || 3030,
  environment: process.env.environment || "development",
  redirectUri:
    process.env.environment || "http://localhost:3030/oauth_callback",
  scope: "user-read-private user-read-email",
  spotifyStateKey: "spotify_auth_state",
};

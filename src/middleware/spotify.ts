import { Next } from "koa";
import { EnhancedContext } from "./index";
import { SpotifyService } from "../services/spotify";
import { Event } from "../services/eventBus";

export async function withSpotifyService(ctx: EnhancedContext, next: Next) {
  ctx.spotifyService = new SpotifyService();
  ctx.eventBus.on(Event.AccessTokenUpdated, (payload) =>
    ctx.spotifyService.updateAccessToken(payload.newAccessToken)
  );

  await next();
}

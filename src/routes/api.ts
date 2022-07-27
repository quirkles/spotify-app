import Router from "@koa/router";
import axios, { AxiosRequestConfig } from "axios";
import { EnhancedContext } from "../middleware";
import { handleAxiosError, UnauthorizedError } from "../errors";
import { Artist, Mood } from "../services";
import { fromTopArtistResponseItem } from "../services/spotify/transforms";

export function initApiRoutes(router: Router) {
  router.get("/me", async function (ctx: EnhancedContext, next) {
    if (!ctx.user?.accessToken?.value?.length) {
      ctx.logger.error("No session user found");
      return next();
    }
    const options: AxiosRequestConfig = {
      method: "GET",
      url: "https://api.spotify.com/v1/me",
      headers: { Authorization: "Bearer " + ctx.user.accessToken.value },
      responseType: "json",
    };

    const testGetResponse = await axios(options).catch(handleAxiosError);
    ctx.body = testGetResponse.data;
    await next();
  });

  router.post("/mood", async function (ctx: EnhancedContext, next) {
    if (!ctx.user?.accessToken?.value?.length) {
      throw new UnauthorizedError("You must be logged in");
    }
    const moodRepository = ctx.sqlService.getRepository("Mood");
    const artistRepository = ctx.sqlService.getRepository("Artist");
    const topArtists = await ctx.spotifyService.getTopItems({
      type: "artists",
    });
    const artists: Artist[] = topArtists.items.map((artistData) =>
      artistRepository.create(fromTopArtistResponseItem(artistData))
    );
    let savedArtists: Artist[];
    try {
      savedArtists = await ctx.sqlService
        .getManager("artist")
        .saveMultipleArtist(artists);
    } catch (err) {
      throw new Error(`Failed to save artists: ${(err as Error).message}`);
    }
    let savedMood: Mood;
    try {
      savedMood = await moodRepository.save({
        ...ctx.request.body,
        artists: savedArtists,
      });
    } catch (err) {
      throw new Error(`Failed to save mood: ${(err as Error).message}`);
    }
    ctx.body = savedMood;
    await next();
  });
}

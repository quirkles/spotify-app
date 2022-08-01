import Router from "@koa/router";
import { EnhancedContext } from "../middleware";
import { UnauthorizedError } from "../errors";
import { Artist, Mood } from "../services";
import { fromTopArtistResponseItem } from "../services/spotify/transforms";
import { getRandomElementFromArray, getRandomSampleOfArray } from "../utils";

export interface GetMoodsParams {
  limit?: number;
  includeArtists?: boolean;
  sortBy?: "createdAt" | "play_count";
  sortDirection?: "asc" | "desc";
}

export function initMoodRoutes(router: Router) {
  const defaultParams: GetMoodsParams = {
    limit: 10,
    includeArtists: true,
    sortBy: "createdAt",
    sortDirection: "desc",
  };
  router.get("/mood", async function (ctx: EnhancedContext, next) {
    const urlQueryParams: GetMoodsParams = ctx.request.query || {};
    const params = {
      ...defaultParams,
      ...urlQueryParams,
    };

    ctx.logger.info("url params", { urlQueryParams });
    ctx.logger.info("params", { params });

    const moodRepository = ctx.sqlService.getRepository("Mood");

    const orderBy = `mood.${params.sortBy as string}`;
    const moodQuery = moodRepository
      .createQueryBuilder("mood")
      .orderBy(orderBy, params.sortDirection?.toUpperCase() as "ASC" | "DESC")
      .take(params.limit);
    if (params.includeArtists) {
      moodQuery.leftJoinAndSelect("mood.artists", "artists");
    }

    const moods = await moodQuery.getMany();
    ctx.body = { moods, params };
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
      time_range: getRandomElementFromArray([
        "short_term",
        "long_term",
        "medium_term",
      ]),
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
        playCount: 0,
        artists: getRandomSampleOfArray(savedArtists, 15),
        createdBy: ctx.user?.userSpotifyId,
      });
    } catch (err) {
      throw new Error(`Failed to save mood: ${(err as Error).message}`);
    }
    ctx.body = savedMood;
    await next();
  });

  router.patch("/mood/:moodId", async function (ctx: EnhancedContext, next) {
    const patchableMoodFields: (keyof Mood)[] = [
      "name",
      "playCount",
      "description",
    ];
    if (!ctx.user?.accessToken?.value?.length) {
      throw new UnauthorizedError("You must be logged in");
    }
    const moodRepository = ctx.sqlService.getRepository("Mood");
    const mood = await moodRepository.findOne({
      where: {
        createdBy: ctx.user?.userSpotifyId,
        id: ctx.params["moodId"],
      },
    });
    if (!mood) {
      ctx.status = 404;
      return next();
    }
    const payload: Partial<Mood> = ctx.request.body;
    let needsSaving = false;
    for (const field of patchableMoodFields) {
      if (Object.prototype.hasOwnProperty.call(payload, field)) {
        needsSaving = true;
        (mood[field] as Partial<Mood>[typeof field]) = payload[field] as string;
      }
    }
    await moodRepository.save(mood);
    ctx.body = { mood };
    await next();
  });
}

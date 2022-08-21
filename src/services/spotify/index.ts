import axios, { AxiosError } from "axios";
import { HTTPRequestError } from "../../errors";
import { getRandomSampleOfArray, removeDupesFromArrayFrom } from "../../utils";
import { Mood } from "../sql";
import {
  TopArtist,
  TopArtistResponse,
  RelatedArtistsResponse,
  RelatedArtist,
} from "./apiResponseTypeDefinitions";
export * from "./responses";

export class SpotifyService {
  private accessToken: string | null = null;
  constructor(accessToken?: string) {
    if (accessToken) {
      this.accessToken = accessToken;
    }
  }

  private async getUrl<T>(url: string): Promise<T> {
    if (!this.accessToken) {
      throw new Error("No access token configured");
    }
    try {
      const response = await axios.get(url, {
        headers: { Authorization: "Bearer " + this.accessToken },
        responseType: "json",
      });
      return response.data;
    } catch (err) {
      throw new HTTPRequestError(err as AxiosError);
    }
  }
  updateAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }
  getTopItems(params: {
    type: "artists" | "tracks";
    limit?: number;
    time_range?: "short_term" | "medium_term" | "long_term";
  }): Promise<TopArtistResponse> {
    params.limit = params.limit || 50;
    params.time_range = params.time_range || "medium_term";
    const { type, ...rest } = params;
    const queryString = Object.entries(rest)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    return this.getUrl(
      `https://api.spotify.com/v1/me/top/${type}?${queryString}`
    );
  }

  async getArtistRecommendationsFromMood(params: {
    mood: Mood;
    limit?: number;
  }): Promise<TopArtist[]> {
    const { artists = [] } = params.mood;
    const limit = params.limit || 50;
    const artistsToFindRelated = getRandomSampleOfArray(
      artists,
      Math.ceil(limit / 5)
    ).map((artist) => artist.spotifyId);
    const results: RelatedArtist[] = (
      await Promise.all(
        artistsToFindRelated.map((artistId) =>
          this.getUrl(
            `https://api.spotify.com/v1/artists/${artistId}/related-artists`
          )
        )
      )
    ).flatMap((result) => (result as RelatedArtistsResponse).artists);
    return getRandomSampleOfArray(
      removeDupesFromArrayFrom(results, ({ uri }) => uri),
      limit
    );
  }
}

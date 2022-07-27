import axios, { AxiosError } from "axios";
import { HTTPRequestError } from "../../errors";
import { TopArtistResponse } from "./apiResponseTypeDefinitions/topItems";
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
    params.limit = params.limit || 20;
    params.time_range = params.time_range || "medium_term";
    const { type, ...rest } = params;
    const queryString = Object.entries(rest)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    return this.getUrl(
      `https://api.spotify.com/v1/me/top/${type}?${queryString}`
    );
  }
}

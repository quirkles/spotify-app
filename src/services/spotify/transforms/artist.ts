import { TopArtist } from "../apiResponseTypeDefinitions";
import { Artist } from "../../sql";

export function fromTopArtistResponseItem(
  item: TopArtist
): Omit<Artist, "id" | "moods"> {
  return {
    name: item.name,
    externalSpotifyUrl: item.external_urls.spotify,
    imageUrl: item.images.reduce((largest, curr) => {
      return largest.width || Number.NEGATIVE_INFINITY > curr.width
        ? largest
        : curr;
    }).url,
    spotifyId: item.id,
    spotifyUri: item.uri,
  };
}

import { In, Repository } from "typeorm";
import { Artist } from "../entities";
import { Logger } from "winston";
import { prop } from "ramda";

export class ArtistManager {
  constructor(
    private artistRepository: Repository<Artist>,
    private logger: Logger
  ) {}
  async saveMultipleArtist(artists: Artist[]): Promise<Artist[]> {
    await this.artistRepository
      .createQueryBuilder("artists")
      .insert()
      .values(artists)
      .orIgnore()
      .execute();
    return this.artistRepository.find({
      where: {
        spotifyId: In(artists.map(prop("spotifyId"))),
      },
    });
  }
  async saveArtist(artist: Artist): Promise<Artist | null> {
    await this.artistRepository
      .createQueryBuilder("artists")
      .insert()
      .values([artist])
      .orIgnore()
      .execute();
    return this.artistRepository.findOne({
      where: {
        spotifyId: artist.spotifyId,
      },
    });
  }
}

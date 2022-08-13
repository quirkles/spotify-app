import "reflect-metadata";
import { Logger } from "winston";

import { DataSource, Repository } from "typeorm";

import { Mood, Artist } from "./entities";
import { ArtistManager } from "./managers/artist";

export * from "./entities";
export * from "./dataSource";

interface entities {
  Mood: Mood;
  Artist: Artist;
}

export class SqlService {
  private readonly managers: {
    artist: ArtistManager;
  };
  constructor(private logger: Logger, private dataSource: DataSource) {
    this.managers = {
      artist: new ArtistManager(dataSource.getRepository(Artist), logger),
    };
  }

  getRepository<T extends keyof entities>(
    entityName: T
  ): Repository<entities[T]> {
    return this.dataSource.getRepository(entityName);
  }

  getManager<T extends keyof typeof this.managers>(
    entityType: T
  ): typeof this.managers[T] {
    return this.managers[entityType];
  }
}

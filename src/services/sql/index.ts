import "reflect-metadata";
import * as path from "path";
import { Logger } from "winston";

import { DataSource, DataSourceOptions, Repository } from "typeorm";

import { CONFIG } from "../../config";
import { SECRETS } from "../../secrets";

import { Mood, Artist } from "./entities";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { ArtistManager } from "./managers/artist";

export * from "./entities";

interface entities {
  Mood: Mood;
  Artist: Artist;
}

let dataSource: DataSource;

export async function getDataSource(logger: Logger): Promise<DataSource> {
  if (dataSource) {
    return dataSource;
  }
  const typeOrmConfig: DataSourceOptions = {
    type: "postgres",
    host: CONFIG.postgresHost,
    port: parseInt(CONFIG.postgresPort, 10),
    username: process.env.IS_CLOUD ? SECRETS.cloudPgUser : SECRETS.pgUser,
    password: process.env.IS_CLOUD ? SECRETS.cloudPgPwd : SECRETS.pgPwd,
    database: "spotify",
    entities: [Mood, Artist],
    migrations: [path.join("..", "migrations")],
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
  };
  logger.info("typeorm config", typeOrmConfig);
  dataSource = new DataSource(typeOrmConfig);
  await dataSource
    .initialize()
    .then(() => {
      logger.info("Initialized data source");
    })
    .catch((error) => logger.error("Failed to initialize datasource", error));
  return dataSource;
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

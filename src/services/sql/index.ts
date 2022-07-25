import connection, { Knex } from "knex";
import { CONFIG } from "../../config";
import { MoodRepository } from "./repositories/mood";
import { SECRETS } from "../../secrets";

interface RepositoryMap {
  mood: MoodRepository;
}

export class SqlService {
  private connection: Knex;
  private repositoryMap: RepositoryMap;

  constructor() {
    this.connection = connection({
      client: "pg",
      connection: {
        host: CONFIG.postgresHost,
        port: parseInt(CONFIG.postgresPort, 10),
        user: SECRETS.pgUser,
        password: SECRETS.pgPwd,
        database: "spotify",
      },
    });

    this.repositoryMap = {
      mood: new MoodRepository(this.connection),
    };
  }
  getRepository<T extends keyof RepositoryMap>(
    repositoryName: T
  ): RepositoryMap[T] {
    return this.repositoryMap[repositoryName];
  }
}

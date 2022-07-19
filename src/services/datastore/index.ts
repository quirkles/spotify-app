import { Logger } from "winston";
import { Datastore } from "@google-cloud/datastore";
import { BaseRepository, UserSessionDataRepository } from "./repositories";
import { UserSessionData } from "./kinds";

interface RepositoryMap {
  userSessionData: BaseRepository<UserSessionData>;
}

export class DataStoreService {
  private readonly repositoryMap: RepositoryMap;
  private logger: Logger;
  constructor(private datastore: Datastore, logger: Logger) {
    this.logger = logger;
    this.repositoryMap = {
      userSessionData: new UserSessionDataRepository(datastore, logger),
    };
  }

  getRepository<T extends keyof RepositoryMap>(
    repositoryName: T
  ): RepositoryMap[T] {
    return this.repositoryMap[repositoryName];
  }
}

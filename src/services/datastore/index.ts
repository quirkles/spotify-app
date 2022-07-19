import { Logger } from "winston";
import { Datastore } from "@google-cloud/datastore";

import { UserSessionDataKindRepository } from "./repositories";

interface RepositoryMap {
  userSessionData: UserSessionDataKindRepository;
}

export class DataStoreService {
  private readonly repositoryMap: RepositoryMap;
  private logger: Logger;
  constructor(private datastore: Datastore, logger: Logger) {
    this.logger = logger;
    this.repositoryMap = {
      userSessionData: new UserSessionDataKindRepository(datastore, logger),
    };
  }

  getRepository<T extends keyof RepositoryMap>(
    repositoryName: T
  ): RepositoryMap[T] {
    return this.repositoryMap[repositoryName];
  }
}

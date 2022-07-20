import { Kind } from "../kinds";
import { Datastore } from "@google-cloud/datastore";
import { Logger } from "winston";

export class BaseRepository<T extends Kind> {
  constructor(private datastore: Datastore, protected logger: Logger) {}
  async save(kind: T): Promise<T> {
    this.logger.debug("Saving entity", kind);
    const { keyPair, data } = kind.entity;

    const key = this.datastore.key(keyPair);

    await this.datastore.save({
      key,
      data,
    });

    return kind;
  }

  async update(kind: T): Promise<T> {
    this.logger.debug("Updating entity", kind);
    const { keyPair, data } = kind.entity;

    const key = this.datastore.key(keyPair);

    await this.datastore.merge({
      key,
      data,
    });

    return kind;
  }

  async getByKey(keyName: string, kind?: string): Promise<T["data"]> {
    const constructorName = this.constructor.name;
    const keyPair = [
      kind ||
        constructorName.substring(0, constructorName.lastIndexOf("Repository")),
      keyName,
    ];

    const key = this.datastore.key(keyPair);

    const [entity] = await this.datastore.get(key);

    return entity;
  }
}

import { BaseModel } from "../models";
import { Knex } from "knex";

export abstract class BaseRepository<T extends BaseModel> {
  connection: Knex;
  tableName!: string;
  constructor(connection: Knex) {
    this.connection = connection;
  }
  abstract create(data: T): Promise<T>;
}

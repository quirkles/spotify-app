import { BaseRepository } from "./baseRepository";
import { Mood } from "../models";
import { Knex } from "knex";

export class MoodRepository extends BaseRepository<Mood> {
  tableName = "mood";
  constructor(connection: Knex) {
    super(connection);
  }
  async create(data: Mood): Promise<Mood> {
    return this.connection(this.tableName).insert(data);
  }
}

import { BaseRepository } from "./baseRepository";
import { Mood } from "../models";
import { Knex } from "knex";

export class MoodRepository extends BaseRepository<Mood> {
  tableName = "mood";
  constructor(connection: Knex) {
    super(connection);
  }
  async create(data: Omit<Mood, "id">): Promise<Mood> {
    const result = await this.connection(this.tableName).insert(data, ["id"]);
    return {
      id: result[0].id,
      ...data,
    };
  }
}

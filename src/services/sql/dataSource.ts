import { DataSource, DataSourceOptions } from "typeorm";
import { CONFIG } from "../../config";
import { SECRETS } from "../../secrets";
import { Artist, Mood } from "./entities";
import { migrations } from "./migrations";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const typeOrmConfig: DataSourceOptions = {
  type: "postgres",
  host: CONFIG.postgresHost,
  port: parseInt(CONFIG.postgresPort, 10),
  username: SECRETS.pgUser,
  password: SECRETS.pgPwd,
  database: "spotify",
  entities: [Mood, Artist],
  migrations,
  synchronize: !process.env.IS_CLOUD,
  namingStrategy: new SnakeNamingStrategy(),
};

export const dataSource = new DataSource(typeOrmConfig);

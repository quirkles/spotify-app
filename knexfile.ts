import type { Knex } from "knex";
import { CONFIG } from "./src/config";
import { SECRETS } from "./src/secrets";

const config: { [key: string]: Knex.Config } = {
  local: {
    client: "postgresql",
    connection: {
      host: CONFIG.postgresHost,
      port: parseInt(CONFIG.postgresPort, 10),
      user: SECRETS.pgUser,
      password: SECRETS.pgPwd,
      database: "spotify",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      host: CONFIG.postgresHost,
      port: parseInt(CONFIG.postgresPort, 10),
      user: SECRETS.pgUser,
      password: SECRETS.pgPwd,
      database: "spotify",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

module.exports = config;

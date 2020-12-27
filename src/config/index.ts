import dotenvExtended from "dotenv-extended";
import dotenvParseVariables from "dotenv-parse-variables";

const env = dotenvExtended.load({
  path: process.env.ENV_FILE,
  defaults: "./config/.env.defaults",
  schema: "./config/.env.schema",
  includeProcessEnv: true,
  silent: false,
  errorOnMissing: true,
  errorOnExtra: true,
});

const parsedEnv = dotenvParseVariables(env);

// Define log levels type (silent + Winston default npm)
type LogLevel =
  | "silent"
  | "error"
  | "warn"
  | "info"
  | "http"
  | "verbose"
  | "debug"
  | "silly";

interface Config {
  privateKeyFile: string;
  privateKeyPassphrase: string;
  publicKeyFile: string;

  localCacheTtl: number;

  redisUrl: string;

  mongo: {
    url: string;
    useCreateIndex: boolean;
    autoIndex: boolean;
  };

  pg: {
    client: string;
    connection: {
      host: string;
      username: string;
      password: string;
      database: string;
    };
    pool: {
      max: number;
      min: number;
      propagateCreateError: boolean;
    };
    migrations: {
      directory: string;
      tablename: string;
    };
  };

  morganLogger: boolean;
  morganBodyLogger: boolean;
  exmplDevLogger: boolean;
  loggerLevel: LogLevel;
}

const config: Config = {
  privateKeyFile: parsedEnv.PRIVATE_KEY_FILE as string,
  privateKeyPassphrase: parsedEnv.PRIVATE_KEY_PASSPHRASE as string,
  publicKeyFile: parsedEnv.PUBLIC_KEY_FILE as string,

  localCacheTtl: parsedEnv.LOCAL_CACHE_TTL as number,

  redisUrl: parsedEnv.REDIS_URL as string,

  mongo: {
    url: parsedEnv.MONGO_URL as string,
    useCreateIndex: parsedEnv.MONGO_CREATE_INDEX as boolean,
    autoIndex: parsedEnv.MONGO_AUTO_INDEX as boolean,
  },

  pg: {
    client: parsedEnv.PG_CLIENT as string,
    connection: {
      host: parsedEnv.PG_URL as string,
      username: parsedEnv.PG_USER as string,
      password: parsedEnv.PG_PASSWORD as string,
      database: parsedEnv.PG_DATABASE as string,
    },
    pool: {
      max: 50,
      min: 2,
      propagateCreateError: false,
    },
    migrations: {
      directory: "./database/migrations",
      tablename: "knex_migrations",
    },
  },

  morganLogger: parsedEnv.MORGAN_LOGGER as boolean,
  morganBodyLogger: parsedEnv.MORGAN_BODY_LOGGER as boolean,
  exmplDevLogger: parsedEnv.EXMPL_DEV_LOGGER as boolean,
  loggerLevel: parsedEnv.LOGGER_LEVEL as LogLevel,
};

export default config;

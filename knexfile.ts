//import config from "@exmpl/config";
// Update with your config settings.

module.exports = {
  client: "pg",
  connection: {
    host: "172.17.0.2",
    username: "postgres",
    password: "docker",
    database: "ucene",
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
};

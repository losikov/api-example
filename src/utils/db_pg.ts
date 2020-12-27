import Knex from "knex";
import { Model } from "objection";
import config from "@exmpl/config";
const knex = Knex(config.pg);

/**
 * Export `initializeDatabase`.
 */
export const initializeDatabase = async () => {
  //drop database
  console.log(`About to drop ${config.pg.connection.database}`);
  knex.raw(`DROP DATABASE ${config.pg.connection.database}`);
  console.log(`About to create ${config.pg.connection.database}`);
  //create database
  knex.raw(`CREATE DATABASE ${config.pg.connection.database}`);
  //rollback migrations
  await knex.migrate.rollback();
  //migrate tables
  await knex.migrate.latest();
};

export const connectDatabase = () => Model.knex(knex);

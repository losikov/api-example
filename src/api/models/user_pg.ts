import { Model } from "objection";

export default class User extends Model {
  id!: string;
  firstname!: string;
  lastname!: string;

  static get tableName() {
    return "users";
  }
}

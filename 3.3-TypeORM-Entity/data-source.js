require("reflect-metadata");
const { DataSource } = require("typeorm");
const { User } = require("./entity/User");

module.exports.AppDataSource = new DataSource({
  type: "mysql",
  host: "mysql", // use "mysql" in devcontainer - service name in docker-compose.yml
  port: 3306,
  username: "root", // change according to your MySQL
  password: "root", // change according to your MySQL
  database: "typeorm_entities", // make sure this DB exists
  synchronize: true, // auto-create tables
  logging: false,
  entities: [User], // If the entity is not listed in the array, the table will NOT be created.
});

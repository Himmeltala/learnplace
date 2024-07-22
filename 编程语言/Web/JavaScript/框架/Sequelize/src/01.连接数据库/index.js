const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  host: "localhost",
  port: 3306,
  username: "root",
  password: "zrf123456",
  dialect: "mysql",
  database: "test"
});

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

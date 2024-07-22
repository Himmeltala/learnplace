const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  host: "localhost",
  port: 3306,
  username: "root",
  password: "zrf123456",
  dialect: "mysql",
  database: "test"
});

/**
 * 定义模型，通常数据库的表名为复数，模型的名称为单数。所以 user 对应 users。
 * 模型中的一个对象(该对象映射到数据库中表的一行)。
 */
const User = sequelize.define("user", {
  username: DataTypes.TEXT,
  password: {
    type: DataTypes.STRING(11),
    defaultValue: "123456"
  }
});

const Comment = sequelize.define("comment", {
  content: DataTypes.TEXT
});

User.hasMany(Comment);
Comment.belongsTo(User);

sequelize.sync();

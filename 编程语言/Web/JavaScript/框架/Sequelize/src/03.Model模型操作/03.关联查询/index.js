const { Sequelize, DataTypes, Op } = require("sequelize");
const express = require("express");
const app = express();

const sequelize = new Sequelize({
  host: "localhost",
  port: 3306,
  username: "root",
  password: "zrf123456",
  dialect: "mysql",
  database: "test"
});

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

/**
 * 关联模型，一对多，User 与 Comment 是一对多的关系。
 */
User.hasMany(Comment);
Comment.belongsTo(User);

/**
 * 为表创建几个数据
 */
User.bulkCreate([
  {
    username: "shiramashiro",
    password: "654321"
  },
  {
    username: "javascript",
    password: "js123456"
  }
]);

Comment.bulkCreate([
  {
    content: "内容111",
    userId: 1
  },
  {
    content: "内容222",
    userId: 1
  },
  {
    content: "内容333",
    userId: 1
  },
  {
    content: "内容444",
    userId: 2
  },
  {
    content: "内容555",
    userId: 2
  }
]);

sequelize.sync();

app.get("/", (req, res) => {
  User.findAll({ include: Comment })
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      console.log(error);
    });
});

app.listen(3000, () => {
  console.log("app has runnning at localhost:3000");
});

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

/**
 * 查询所有字段。
 *
 * 对应 select * from tableName。
 */
app.get("/", (req, res) => {
  User.findAll()
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      throw error;
    });
});

/**
 * 查询特定字段。
 *
 * 对应 select attr1, attr2 from tableName。
 */
app.get("/get/by/attributes", (req, res) => {
  User.findAll({
    attributes: ["name", "age"]
  })
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      throw error;
    });
});

/**
 * 条件查询。
 *
 * 对应 select * from tableName where ...
 */
app.get("/get/by/where", (req, res) => {
  User.findAll({
    attributes: ["id", "name", "age", "cash"],
    where: {
      id: 1
    }
  })
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      throw error;
    });
});

/**
 * where 实际上是 Op，Op 对应着 SQL 运算符，如 Op.eq 就是 =。
 *
 * attr1 后紧跟着 Op.eq 对应着 where attr1 = value1。
 * where 后面紧跟 Op.and 对应着 where attr1 = value1 and attr2 = value2。
 *
 * 所以结合起来使用就是下面的例子：
 */
app.get("/get/by/where/op", (req, res) => {
  User.findAll({
    where: {
      [Op.and]: [
        {
          id: {
            [Op.eq]: 1
          }
        },
        {
          cash: 1500
        }
      ]
    }
  })
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      throw error;
    });
});

app.listen(3000, () => {
  console.log("app has runnning at localhost:3000");
});

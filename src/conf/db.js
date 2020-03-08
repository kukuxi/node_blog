const env = process.env.NODE_ENV; // 获取环境变量，该值是在package.json中定义的，比如执行npm run dev时 NODE_ENV=dev

let MYSQL_CONF;

if (env === "dev") {
  MYSQL_CONF = {
    host: "localhost",
    user: "root",
    password: "",
    port: "3306",
    database: "myblog"
  };
}

if (env === "product") {
  MYSQL_CONF = {
    host: "localhost", // 线上参数不一样，本课程中暂时一样
    user: "root",
    password: "shimina1995",
    port: "3306",
    database: "myblog"
  };
}

module.exports = {
  MYSQL_CONF
};

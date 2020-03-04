const { exec } = require("../db/mysql");
const getList = (author, keywords) => {
  let sql = `select * from blog where 1=1 `;
  if (author) {
    sql += `and author=${author} `;
  }
  if (keywords) {
    sql += `and title like '%${keywords}%' `;
  }
  sql += "order by creattime desc;";
  // 返回一个promise
  return exec(sql);
};

function getDetail(id) {
  return {
    id: 1,
    title: "标题A",
    content: "内容A",
    createTime: 1575547544823,
    author: "张三"
  };
}

const newBlog = (blogData = {}) => {
  console.log("blogData", blogData);
  return {
    id: 3 //表示新建博客，插入到数据库的id
  };
};

const updateBlog = (id, blogData) => {
  console.log("blogData", id, blogData);
  return true;
};
const deleteBlog = (id, blogData) => {
  console.log("blogData", id, blogData);
  return true;
};
module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
};

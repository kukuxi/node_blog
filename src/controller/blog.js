const { exec } = require("../db/mysql");
const getList = (author, keywords) => {
  let sql = `select * from blogs where 1=1 `;
  if (author) {
    sql += `and author='${author}' `;
  }
  if (keywords) {
    sql += `and title like '%${keywords}%' `;
  }
  sql += "order by createtime desc";
  // 返回一个promise
  return exec(sql);
};

function getDetail(id) {
  const sql = `select * from blogs where id='${id}'`;
  return exec(sql).then(rows => rows[0]);
}

const newBlog = (blogData = {}) => {
  const { author, title, content } = blogData;
  const createtime = +new Date();
  const sql = `
    insert into blogs (title, content, createtime, author)
    values('${title}', '${content}', ${createtime}, '${author}')
  `;
  return exec(sql).then(data => {
    return {
      id: data.insertId
    };
  });
};

const updateBlog = (id, blogData) => {
  const { content, title } = blogData;
  const sql = `
  update blogs set content='${content}', title='${title}' where id=${id}
  `;

  return exec(sql).then(updateData => {
    if (updateData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};
const deleteBlog = (id, author) => {
  const sql = `
    delete from blogs where id=${id} and author='${author}'
  `;
  return exec(sql).then(deleteData => {
    if (deleteData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};
module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
};

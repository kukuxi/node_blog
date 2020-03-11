const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
} = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../model/resModel");
// 统一的登录验证
const loginCheck = (req) => {
  if (!req.session.username) {
    return Promise.resolve(new ErrorModel('尚未登录'))
  }
}
const handleBlogRouter = (req, res) => {
  const { method, url, path, query } = req;
  const { id } = query;
  // 获取博客列表
  if (method === "GET" && req.path === "/api/blog/list") {
    const { author = "", keyword = "" } = query;
    // const listData = getList(author, keyword)
    // return new SuccessModel(listData)
    console.log('req.session :', req.session);
    const loginResult = loginCheck(req);
    if (loginResult) {
      return loginResult
    }
    const result = getList(author, keyword);
    return result.then(listData => {
      return new SuccessModel(listData);
    });
  }

  // 获取博客详情
  if (method === "GET" && req.path === "/api/blog/detail") {
    const result = getDetail(id);
    return result.then(data => {
      return new SuccessModel(data);
    });
  }

  // 新建一篇博客
  if (method === "POST" && req.path === "/api/blog/new") {
    const author = "zhangsan"; // 假数据
    const loginResult = loginCheck(req);
    if (loginResult) {
      return loginResult
    }
    req.body.author = req.session.username;
    const result = newBlog(req.body);
    return result.then(data => {
      return new SuccessModel(data);
    });
  }

  // 更新一篇博客
  if (method === "POST" && req.path === "/api/blog/update") {
    const result = updateBlog(id, req.body);
    // msg: "这是更新博客的接口"
    const loginResult = loginCheck(req);
    if (loginResult) {
      return loginResult
    }
    return result.then(val => {
      if (val) {
        return new SuccessModel();
      } else {
        return new ErrorModel("更新失败");
      }
    });
  }

  // 删除一篇博客
  if (method === "POST" && req.path === "/api/blog/delete") {
    // const author = "zhangsan"; // 假数据
    const loginResult = loginCheck(req);
    if (loginResult) {
      return loginResult
    }
    const result = deleteBlog(id, author);
    // msg: "这是更新博客的接口"
    return result.then(val => {
      if (val) {
        return new SuccessModel();
      } else {
        return new ErrorModel("更新失败");
      }
    });
  }
};

module.exports = handleBlogRouter;

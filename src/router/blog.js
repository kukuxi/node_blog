const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
} = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../model/resModel");
const handleBlogRouter = (req, res) => {
  const { method, url, path, query } = req;
  const { id } = query;
  const router = {
    GET: {
      "/api/list": () => {
        const { author = "", keywords = "" } = query;
        // const listData = getList(author, keywords);
        // return new SuccessModel(listData);
        const result = getList(author, keywords);
        return result.then(listData => new SuccessModel(listData));
      },
      "/api/detail": () => {
        const data = getDetail(id);
        return new SuccessModel(data);
      }
    },
    POST: {
      "/api/blog/new": () => {
        const blogDada = req.body;
        const data = newBlog(req.body);
        return new SuccessModel(data);
        // msg: "这是新建博客的接口";
      },

      "/api/blog/update": () => {
        const result = updateBlog(id);
        // msg: "这是更新博客的接口"
        if (result) {
          return new SuccessModel();
        } else {
          return new ErrorModel("更新失败");
        }
      },
      "/api/blog/delete": () => {
        // msg: "这是删除博客的接口"
        const result = deleteBlog(id);
        if (result) {
          return new SuccessModel();
        } else {
          return new ErrorModel("删除博客失败");
        }
      }
    }
  };

  if (router[method][path]) {
    return router[method][path]();
  }
};

module.exports = handleBlogRouter;

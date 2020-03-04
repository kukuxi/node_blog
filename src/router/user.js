const { loginCheck } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");
const handleUserRouter = (req, res) => {
  const { method, url } = req;
  const path = url.split("?")[0];

  const router = {
    //   GET: {
    //     "/api/list": {
    //       msg: "这是获取博客列表的接口"
    //     }
    //   },
    POST: {
      "/api/user/login": () => {
        // msg: "这是登录的接口"
        const { username, password } = req.body;
        const result = loginCheck(username, password);
        if (result) {
          return new SuccessModel();
        } else {
          return new ErrorModel("登录失败");
        }
      }
    }
  };

  if (router[method][path]) {
    return router[method][path]();
  }
};

module.exports = handleUserRouter;

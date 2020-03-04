const querystring = require("querystring");
const handleUserRouter = require("./src/router/user");
const handleBlogRouter = require("./src/router/blog");

const getPostData = req => {
  return new Promise((resolve, reject) => {
    if (req.method === "get") {
      resolve({});
      return;
    }
    if (req.headers["content-type"] !== "application/json") {
      resolve({});
      return;
    }

    let postData = "";
    req.on("data", chunk => {
      postData += chunk.toString();
    });

    req.on("end", () => {
      console.log(postData);
      if (!postData) {
        resolve({});
        return;
      }
      resolve(JSON.parse(postData));
    });
  });
};

//公共参数等公共方法在这里处理
const serverHandler = (req, res) => {
  //返回json
  res.setHeader("Content-Type", "application/json");

  //解析path
  const { url } = req;
  req.path = url.split("?")[0];
  // 解析query
  req.query = querystring.parse(url.split("?")[1]);
  getPostData(req).then(postData => {
    req.body = postData;

    //处理blog路由
    // const blogData = handleBlogRouter(req, res);
    // if (blogData) {
    //   res.end(JSON.stringify(blogData));
    //   return;
    // }
    const blogResult = handleBlogRouter(req, res);
    if (blogResult) {
      blogResult.then(blogData => {
        res.end(JSON.stringify(blogData));
        return;
      });
    }

    const userData = handleUserRouter(req, res);

    if (userData) {
      res.end(JSON.stringify(userData));
      return;
    }

    //未命中返回404
    res.writeHeader(404, { "Content-Type": "text/plain" });
    res.write("404 Not Found\n");
    res.end();
  });
};

module.exports = serverHandler;

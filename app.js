const querystring = require("querystring");
const handleUserRouter = require("./src/router/user");
const handleBlogRouter = require("./src/router/blog");
// 设置过期时间
function getCookieExpires() {
  const d = new Date();
  const oneDay = 1000 * 60 * 60 * 24;
  d.setDate = (d.getTime(), oneDay);
  console.log('d.toGMTString() :', d.toGMTString());
  return d.toGMTString()
}
// session数据
let SESSION_DATA = {};
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
  req.path = url.split("?")[0]
  // 解析cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || '' // 格式k1=1;k2=2;
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return;
    }
    const [value, key] = item.split('=');
    req.cookie[value.trim()] = key;
  });

  // 解析session
  let userId = req.cookie.userid;
  let needSetCookie = false
  if (userId) {
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {};
    }
  } else {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    SESSION_DATA[userId] = {};

  }
  req.session = SESSION_DATA[userId];

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
        if (needSetCookie) {

          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)

        }
        res.end(JSON.stringify(blogData));
        return;
      });
    }


    const userResult = handleUserRouter(req, res);
    if (userResult) {
      if (needSetCookie) {
        res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)

      }
      userResult.then(userData => {

        res.end(JSON.stringify(userData));
        return;
      });
    }
    //未命中返回404
    // res.writeHeader(404, { "Content-Type": "text/plain" });
    // res.write("404 Not Found\n");
    // res.end();
  });
};

module.exports = serverHandler;

const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 设置过期时间
function getCookieExpires() {
  const d = new Date();
  const oneDay = 1000 * 60 * 60 * 24;
  d.setDate = (d.getTime(), oneDay);
  console.log('d.toGMTString() :', d.toGMTString());
  return d.toGMTString()
}
// const getCookieExpires = () => {
//   const d = new Date()
//   d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
//   console.log('d.toGMTString() is ', d.toGMTString())
//   return d.toGMTString()
// }
const handleUserRouter = (req, res) => {
  const method = req.method // GET POST
  // 登录
  if (method === 'GET' && req.path === '/api/user/login') {

    const { username, password } = req.query
    // const { username, password } = req.query
    const result = login(username, password)
    return result.then(data => {
      if (data.username) {
        res.setHeader('Set-Cookie', `username=${username}; path=/; httpOnly; expires=${getCookieExpires()}`)
        return new SuccessModel()
      }
      return new ErrorModel('登录失败')
    })
  }
  // if (method === 'GET' && req.path === '/api/user/test') {
  //   if (req.cookie.username) {
  //     return new Promise.resolve(new SuccessModel())
  //   }
  //   return new Promise.resolve(new ErrorModel('尚未登录'))
  // }
}

module.exports = handleUserRouter

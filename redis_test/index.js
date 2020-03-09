const redis = require('redis');

// 创建Redis服务
const redisClient = redis.createClient(6379, '127.0.0.1')

redisClient.on('err', (err) => {
    console.error(err);
})

redisClient.set('myname', 'zhangsan3', redis.print);
redisClient.get('myname', (err, val) => {
    if (err) {
        console.error(err)
    }
    console.log('val :', val);

    // 退出
    redisClient.quit()
})
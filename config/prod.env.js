'use strict'
let HOST = process.argv.splice(2)[0] || 'prod';

if(HOST === "development"){
  console.log('正在启动服务。。。');
}else{
  console.log('正在打包到：'+HOST);
}
module.exports = {
  NODE_ENV: '"production"',
  HOST: '"' + HOST + '"'
}

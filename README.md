# 介绍
该项目是anan-cloud项目的Web前端项目，基于Vue-element-admin改造而来，使用vue-cli@3.0构建项目。
主要技术选型：Vue2.x、vuex、vue-i18n、axios、ElementUI2.x等。
anan-cloud项目地址：https://github.com/fosin/anan-cloud

## 构建环境
### 开发环境
设置.env.development中的VUE_APP_BASE_API为开发环境后台API地址。

### 生产环境
设置.env.production中的VUE_APP_BASE_API为后台API地址。
如果部署在nginx或者使用docker部署，则一般不需要修改。

## 构建命令
``` bash
# 安装依赖包
npm install

# 建议不要用cnpm  安装有各种诡异的bug 可以通过如下操作解决npm速度慢的问题
npm install --registry=https://registry.npm.taobao.org
npm install --sass_binary_site=https://npm.taobao.org/mirrors/node-sass

# 启动开发调试 localhost:9528
npm run dev

# 构建生产环境部署包
npm run build:prod

# 构建生产环境报告
npm run build:prod --report
```

# 介绍
该项目是anan-cloud项目的Web前端项目，基于Vue-element-admin改造而来，使用vue-cli@4构建项目。
主要技术选型：Vue2.x、vuex、axios、Element2.x、vue-i18n等。
anan-cloud项目地址：<https://github.com/fosin/anan-cloud>

## 构建环境
### 开发环境
    设置.env.development中的VUE_APP_BASE_API为开发环境后台API地址。

### 生产环境
    设置.env.production中的VUE_APP_BASE_API为后台API地址。
    如果部署在nginx或者使用docker部署，则一般不需要修改。

## 构建命令
```shell script

#Github的raw文件读取地址遭受DNS污染，导致文件下载困难
199.232.68.133 raw.githubusercontent.com

# 安装依赖包
npm install -g @vue/cli

# 安装依赖包
npm install

# 启动开发调试 localhost:9528
npm run dev

# 构建生产环境部署包
npm run build:prod

# 构建生产环境报告
npm run build:prod --report
```

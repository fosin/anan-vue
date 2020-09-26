# 介绍
该项目是anan-cloud项目的Web前端项目，基于Vue-element-admin改造而来，使用vue-cli@4构建项目。
主要技术选型：Vue2.x、vuex、axios、Element2.x、vue-i18n等。
anan-cloud项目地址：<https://github.com/fosin/anan-cloud>

## 构建环境

### Github的raw文件读取地址遭受DNS污染，导致文件下载困难
    199.232.68.133 raw.githubusercontent.com

### 开发环境
    设置.env.development中的VUE_APP_BASE_API为开发环境后台API地址。

### 生产环境
    设置.env.production中的VUE_APP_BASE_API为后台API地址。
    如果部署在nginx或者使用docker部署，则一般不需要修改。

## 使用npm构建命令
```shell script

#修改npm源为国内源，加快依赖下载速度
npm config set registry https://registry.npm.taobao.org --global
npm config set disturl https://npm.taobao.org/dist --global

# 安装vue/cli
npm install -g @vue/cli

#安装babel-plugin-dynamic-import-node插件
npm install babel-plugin-dynamic-import-node -S -D

# 安装依赖包
npm install

# 启动开发调试 localhost:9528
npm run dev

# 构建生产环境部署包
npm run build:prod

# 构建生产环境报告
npm run build:prod --report
```
## 使用yarn构建命令
```shell script
#Github的raw文件读取地址遭受DNS污染，导致文件下载困难
199.232.68.133 raw.githubusercontent.com

#yarn cache和global目录位置的修改
#PS: 如果输入yarn提示没有找到该命令，关闭命令终端，再开一次(linux系统 source一下即可)。
yarn config set cache-folder E:\Tools\OpenSource\Node\node-v12\yarn_cache
yarn config set global-folder E:\Tools\OpenSource\Node\node-v12\yarn_global
#源更换
yarn config set registry https://registry.npm.taobao.org

#配置环境变量,在命令行输入 
#将得到的路径添加到环境变量，这样，通过yarn安装的依赖或命令才能在命令行中有效
yarn global bin

# 安装vue/cli
yarn global add @vue/cli

#安装babel-plugin-dynamic-import-node插件
yarn add babel-plugin-dynamic-import-node -S -D

# 安装依赖包
yarn install

# 启动开发调试 localhost:9528
yarn run dev

# 构建生产环境部署包
yarn run build:prod

# 构建生产环境报告
yarn run build:prod --report
```
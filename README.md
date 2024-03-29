# 介绍

该项目是 anan-cloud 项目的 Web 前端项目，基于 Vue-element-admin 改造而来，使用 vue-cli@4 构建项目。
主要技术选型：Vue2.x、vuex、axios、Element2.x、vue-i18n 等。
anan-cloud 项目地址：<https://github.com/fosin/anan-cloud>

## 构建环境

### Github 的 raw 文件读取地址遭受 DNS 污染，导致文件下载困难

    185.199.110.133 raw.githubusercontent.com

### 下载源码

    git clone https://github.com/fosin/anan-vue

### 安装 nodejs（版本<=14）

    自行百度安装

## 开发指引

### 使用vscode开发（推荐）

    安装插件：
    Vue VS Code Extension Pack
    Auto Rename Tag
    Auto Close Tag
    vscode-element-helper
    ESLint
    npm Intellisense
    Live Server
    JavaScript (ES6) code snippets
    Bracket Pair Colorizer 2

### 使用idea开发

    安装插件：
    vue.js、element、ignore

### chrome调试插件

    vue-devtools

### 使用npm跑源码

    开发环境：
    设置.env.development文件中的VUE_APP_BASE_API为开发环境后台API地址。

```shell script
#修改npm源为国内源，加快依赖下载速度
npm config set registry https://registry.npm.taobao.org --global
npm config set disturl https://npm.taobao.org/dist --global


# 安装vue/cli 4.x
# 安装之后可以使用 vue --version 或者vue -V来检查版本是否安装正确
npm install -g @vue/cli@4.5.17

# 安装依赖包

npm install

# 常见错误
## 问题1：如果报错The unauthenticated git protocol on port 9418 is no longer supported.，则需要设置git
## 或者error D:\Git\Git\bin\git.EXE ls-remote -h -t git://github.com/adobe-webplatform/eve.git
## git config --global url."https://".insteadOf git://

# 启动开发调试 http://localhost:9528/anan-vue/
npm run dev
```

### 源码介绍

    src
      lang： 国际化语言
      router： 前端路由（vue-router）
      store：  前端缓存（vuex）
      utils：axois、加密算法等工具
      views：
        exam：考试系统
        platform：anan框架
        mpi：主索引
        vhr：人力资源
    .env.development：开发环境配置文件
    .env.production：生产环境配置文件

### 相关资料

    vue官网：https://vuejs.org/
    vue指引文档：https://vuejs.org/v2/guide/index.html
    vue-cli：https://cli.vuejs.org/
    vue-router组件：https://router.vuejs.org/
    vuex组件：https://vuex.vuejs.org/
    axios组件：http://www.axios-js.com/zh-cn/docs/vue-axios.html
    element-ui官网：https://element.eleme.cn/#/zh-CN/component/installation

## 生产发布

    设置.env.production文件中的VUE_APP_BASE_API为后台API地址。
    如果部署在nginx或者使用docker部署，则一般不需要修改，默认为/即可。

```shell script
# 构建生产环境部署包
npm run build:prod

# 构建生产环境报告
npm run build:prod --report

# 发布方案1：使用docker nginx发布
docker build . -t registry.cn-hongkong.aliyuncs.com/fosin/anan-vue:3.6.0 -f deploy/Dockerfile

# 发布方案2：使用docker nginx-ingress-controller发布(nginx官方controller)
docker build . -t registry.cn-hongkong.aliyuncs.com/fosin/nginx-ingress-controller:3.6.0 -f deploy/ingress-nginx-controller.Dockerfile

# 发布方案3：使用docker ingress-nginx-controller发布（k8s官方的controller）
docker build . -t registry.cn-hongkong.aliyuncs.com/fosin/ingress-nginx-controller:3.6.0 -f deploy/nginx-ingress-controller.Dockerfile

```

## Build Setup

``` bash

# Clone project
git clone https://github.com/fosin/anan-vue.git

# Install dependencies
npm install

# 建议不要用cnpm  安装有各种诡异的bug 可以通过如下操作解决npm速度慢的问题
npm install --registry=https://registry.npm.taobao.org
npm install --sass_binary_site=https://npm.taobao.org/mirrors/node-sass

# serve with hot reload at localhost:9528
npm run dev

# build for production with minification
npm run build:prod

# build for production and view the bundle analyzer report
npm run build:prod --report
```
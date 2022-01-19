FROM registry.aliyuncs.com/google_containers/nginx-ingress-controller:v1.1.1
MAINTAINER "wechart:fosinstar email: 28860823@qq.com"
COPY dist /usr/local/nginx/html/anan-vue

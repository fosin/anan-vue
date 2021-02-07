FROM nginx:1.15
MAINTAINER fosin 28860823@qq.com
RUN echo "Asia/Shanghai" > /etc/timezone
COPY anan-vue.conf /etc/nginx/conf.d/
COPY dist /usr/share/nginx/html/anan-vue

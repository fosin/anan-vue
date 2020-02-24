FROM nginx:1.15
MAINTAINER fosin 28860823@qq.com
COPY dist /usr/share/nginx/html/anan-vue
COPY anan-vue.conf /etc/nginx/conf.d/
RUN echo "Asia/Shanghai" > /etc/timezone

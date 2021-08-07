FROM nginx:1.15
LABEL maintainer="fosin"
LABEL wechart="fosinstar"
LABEL Email="28860823@qq.com"
RUN echo "Asia/Shanghai" > /etc/timezone
COPY anan-vue.conf /etc/nginx/conf.d/
COPY dist /usr/share/nginx/html/anan-vue

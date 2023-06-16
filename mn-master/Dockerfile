FROM nginx

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime &&\
    echo "Asia/shanghai" > /etc/timezone

COPY error.html /usr/share/nginx/html/error.html
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/  /usr/vue/h5-agent-business/dist/

RUN chmod -R +rw  /usr/share/nginx/html/error.html &&\
    chown -R nginx:nginx /usr/share/nginx/html/error.html &&\
    chmod -R +rw  /usr/vue/h5-agent-business/dist/ &&\
    chown -R nginx:nginx /usr/vue/h5-agent-business/dist/

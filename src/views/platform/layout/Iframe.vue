<template id="myiframe">
  <div>
    <iframe v-if="$route.query.src" :src='src' class="iframe" frameborder="0" ref="iframe"></iframe>
    <iframe v-else="$route.query.url" :src='src' class="iframe" frameborder="0" ref="iframe"></iframe>
  </div>
</template>

<script>
  import axios from 'axios'
  import { loadUIUrl } from '@/api/application'
  import store from '@/store'
  export default {
    name: 'myiframe',
    data: function() {
      return {
        src: 'about:blank'
      }
    },
    mounted() {
      window.onresize = () => {
        this.resize()
      }
      this.resize()
      this.geturl()
    },
    methods: {
      // 加载浏览器窗口变化自适应
      resize() {
        const iframe = this.$refs.iframe
        if (!iframe) {
          return
        }
        const clientHeight = document.documentElement.clientHeight - 88
        iframe.style.height = `${clientHeight}px`
      },
      replaceStr(reg, page, url) {
        const matchs = page.match(reg)
        for (let i = 0; i < matchs.length; i++) {
          const match = matchs[i]
          let replaceStr = match.replace('href="', 'href="' + (url.substr(-1) === '/' ? url : url + '/'))
          page = page.replace(match, replaceStr)
          replaceStr = match.replace('src="', 'src="' + (url.substr(-1) === '/' ? url : url + '/'))
          page = page.replace(match, replaceStr)
        }
        return page
      },
      /**
       * 该处设计了三种获取方式，三种方式各有优缺点，目前没有完美的角色方案，只能按需设置了
       * 1、直接链接：通过this.$route.query.src带access_token参数请求
       * 2、间接链接： 通过向后台请求动态获取http请求地址
       *    a、如果有Basic认证信息，则通过headers向后台请求页面html，然后动态写入iframe中，这种方式不能很好角色有内联html的页面
       *    b、如果没有Basic认证信息，则通过后台返回url带access_token参数请求，这种方式必须设置oauth2 token认证
       */
      geturl: function() {
        if (this.$route.query.src) {
          debugger
          if (this.$route.query.src.startsWith('http')) {
            this.src = this.$route.query.src + '?access_token=' + store.getters.token.access_token
          } else {
            if (process.env.BASE_API && process.env.BASE_API !== '/') {
              this.src = process.env.BASE_API + this.$route.query.src + '?access_token=' + store.getters.token.access_token
            } else {
              this.src = this.$route.query.src + '?access_token=' + store.getters.token.access_token
            }
          }
        }
        if (this.$route.query.url) {
          loadUIUrl(this.$route.query.url).then(response => {
            const urlInfo = response.data
            const url = urlInfo.url
            const headers = urlInfo.headers
            if (headers && headers.Authorization) {
              axios({
                method: 'get',
                url: url,
                timeout: 20000,
                // withCredentials: true, // 跨域请求，允许保存cookie
                headers: headers
              }).then(response => {
                const iframe = this.$refs.iframe.contentWindow.document
                iframe.open('text/html', 'replace')
                const reg = new RegExp(/(href=|src=).+\.(css|png|js|jpg|icon)/g)
                const page = this.replaceStr(reg, response.data, url)
                iframe.write(page)
                iframe.close()
              }).catch(error => {
                this.$notify({
                  title: '获取url失败',
                  message: error,
                  type: 'error',
                  duration: 5000
                })
              })
            } else {
              this.src = url + '?access_token=' + store.getters.token.access_token
            }
          }).catch(reason => {
            this.$notify({
              title: '获取url失败',
              message: reason.message,
              type: 'error',
              duration: 5000
            })
          })
        }
      }
    }
  }
</script>

<style scoped>
.iframe {
  width: 100%;
  height: 100%;
  border: 0;
  overflow: hidden;
  box-sizing: border-box;
}
</style>

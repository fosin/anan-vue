<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon :icon-class="ananLanguage" class-name="international-icon" />
    </div>
    <el-dropdown-menu slot="dropdown" style="width: 200px">
      <div v-for="item of validInternationals" :key="item.id">
        <el-row>
          <el-col :span="4">
            <svg-icon class-name="zh-CN-icon" :icon-class="item.icon" />
          </el-col>
          <el-col :span="20">
            <el-dropdown-item :disabled="ananLanguage===item.code" :command="item">
              {{ item.name }}
            </el-dropdown-item>
          </el-col>
        </el-row>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>

import { getInternationls } from '@/views/platform/international/international'
import { getInternationlCharsets } from '@/views/platform/international/charset/charset'

export default {
  data() {
    return {
      validInternationals: []
    }
  },
  computed: {
    ananLanguage() {
      return this.$store.getters.ananLanguage
    }
  },
  created() {
    getInternationls(0).then(response => {
      this.validInternationals = response.data
      const lang = this.getLanguageByCode(this.ananLanguage)
      this.handleSetLanguage(lang, false)
    }).catch(reason => {
      this.$notify({
        title: '获取在线服务列表失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
  },
  methods: {
    handleSetLanguage(lang, notify = true) {
      if (lang) {
        const code = lang.code
        getInternationlCharsets(lang.id).then(response => {
          const charsetsData = response.data
          for (let i = 0; i < charsetsData.length; i++) {
            this.$i18n.mergeLocaleMessage(code, JSON.parse(charsetsData[i].charset))
          }
          this.$i18n.locale = code
          this.$store.dispatch('setLanguage', code)
          if (notify) {
            this.$message({
              message: this.$t('lang.switchSuccess'),
              type: 'success'
            })
          }
        }).catch(reason => {
          this.$notify({
            title: '获取国际化语言自定义字符集失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      } else {
        this.$notify({
          title: '自动设置语言失败！',
          message: '设置语言时传入的lang参数无效!',
          type: 'error',
          duration: 5000
        })
      }
    },
    getLanguageCharset(id) {
      getInternationlCharsets(id).then(response => {
        return response.data
      }).catch(reason => {
        this.$notify({
          title: '获取国际化语言自定义字符集失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    getLanguageByCode(code) {
      for (const international of this.validInternationals) {
        if (international.code === code) {
          return international
        }
      }
    }
  }
}
</script>

<style scoped>
  .international-icon {
    font-size: 20px;
    cursor: pointer;
    vertical-align: -5px !important;
  }
</style>


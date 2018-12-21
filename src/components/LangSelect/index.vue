<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon :icon-class="language" class-name="international-icon"/>
    </div>
    <el-dropdown-menu slot="dropdown" style="width: 200px">
      <el-row>
        <el-col :span="4">
          <svg-icon class-name="zh-CN-icon" icon-class="zh-CN"/>
        </el-col>
        <el-col :span="20">
          <el-dropdown-item :disabled="language==='zh-CN'" command="zh-CN">简体中文</el-dropdown-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <svg-icon class-name="zh-HK-icon" icon-class="zh-HK"/>
        </el-col>
        <el-col :span="20">
          <el-dropdown-item :disabled="language==='zh-HK'" command="zh-HK">繁体中文</el-dropdown-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <svg-icon class-name="en-UK-icon" icon-class="en-UK"/>
        </el-col>
        <el-col :span="20">
          <el-dropdown-item :disabled="language==='en-UK'" command="en-UK">English</el-dropdown-item>
        </el-col>
      </el-row>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('setLanguage', lang)
      this.$message({
        message: this.$t('lang.switchSuccess'),
        type: 'success'
      })
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


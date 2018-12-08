<template>
  <el-dialog title="选择图标" :visible.sync="dialogUserAvatarVisible" width="90%">
  <div class="icons-container">
    <div class="icons-wrapper">
      <div v-for="item of iconsMap" :key="item" @click="handleClipboard(generateIconCode(item),$event)">
        <el-tooltip placement="top">
          <div slot="content">
            {{ generateIconCode(item) }}
          </div>
          <div class="icon-item">
            <svg-icon :icon-class="item" class-name="disabled" />
            <span>{{ item }}</span>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
  </el-dialog>
</template>

<script>
import icons from './requireIcons'
export default {
  name: 'Icons',
  data() {
    return {
      iconsMap: icons,
      dialogUserAvatarVisible: false,
      callback: undefined
    }
  },
  methods: {
    generateIconCode(symbol) {
      // return 'src/icons/svg/' + symbol + '.svg'
      return symbol
    },
    handleClipboard(text, event) {
      this.callback(text)
      this.dialogUserAvatarVisible = false
    },
    init(callback) {
      this.callback = callback
    },
    show() {
      this.dialogUserAvatarVisible = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;
  .icons-wrapper {
    margin: 0 auto;
  }
  .icon-item {
    margin: 20px;
    height: 110px;
    text-align: center;
    width: 110px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }
  span {
    display: block;
    font-size: 24px;
    margin-top: 10px;
  }
  .disabled{
    pointer-events: none;
  }
}
</style>

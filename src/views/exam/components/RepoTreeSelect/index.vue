<template>
  <el-popover
    ref="popover"
    placement="bottom-start"
    trigger="click"
    @show="onShowPopover"
    @hide="onHidePopover"
  >
    <el-tree
      ref="tree"
      placeholder="选择题库"
      class="select-tree"
      highlight-current
      default-expand-all
      :style="`min-width: ${treeWidth}`"
      :data="treedata"
      :props="props"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :show-checkbox="multi"
      @node-click="onClickNode"
      @check-change="onCheckChange"
    />
    <el-input
      slot="reference"
      ref="input"
      v-model="labelModel"
      clearable
      :style="`width: ${width}px`"
      :class="{ 'rotate': showStatus }"
      suffix-icon="el-icon-arrow-down"
      :placeholder="placeholder"
      @clear="onClearInput"
    />
  </el-popover>
</template>

<script>
import { fetchRepoTree } from '@/views/exam/qu/repo/repo'

export default {
  name: 'RepoTreeSelect',
  // 设置绑定参数
  model: {
    prop: 'value',
    event: 'selected'
  },
  props: {
    // 接收绑定参数
    userId: {
      type: Number,
      default: 0
    },
    // 接收绑定参数
    value: {
      type: String,
      default: ''
    },
    // 输入框宽度
    width: {
      type: Number,
      default: 200
    },
    multi: {
      type: Boolean,
      default: false
    },
    // 输入框占位符
    placeholder: {
      type: String,
      required: false,
      default: '请选择题库'
    }
  },
  data() {
    return {
      // 选项数据
      treedata: [],
      // 树节点配置选项
      props: {
        parent: 'pId',
        value: 'id',
        label: 'title',
        children: 'children',
        leaf: 'leaf'
      },
      // 树状菜单显示状态
      showStatus: false,
      // 菜单宽度
      treeWidth: 'auto',
      // 输入框显示值
      labelModel: '',
      // 实际请求传值
      valueModel: ''
    }
  },
  watch: {
    labelModel(val) {
      if (!val) {
        this.valueModel = ''
      }
      this.$refs.tree.filter(val)
    },
    value(val) {
      this.labelModel = this.getRepoData(val)
    }
  },
  created() {
    // 获取输入框宽度同步至树状菜单宽度
    this.$nextTick(() => {
      this.treeWidth = `${(this.width || this.$refs.input.$refs.input.clientWidth) - 24}px`
    })
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetchRepoTree(this.userId).then(response => {
        this.treedata = response.data
        // 检测输入框原有值并显示对应 label
        if (this.value) {
          this.labelModel = this.getRepoData(this.value)
        }
      }).catch((reason) => {
        this.$notify({
          title: '获取题库数据失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    // 单击节点
    onClickNode(node) {
      this.valueModel = node[this.props.value]
      this.labelModel = node[this.props.label]
      this.$emit('nodeClick', node)
      this.onCloseTree()
    },
    // 单击节点
    onCheckChange(nodes) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (i === 0) {
          this.valueModel = node[this.props.value]
          this.labelModel = node[this.props.label]
        } else {
          this.labelModel = ',' + node[this.props.label]
        }
      }
      this.$emit('selected', this.labelModel)
      this.$emit('checkChange', nodes)
    },
    // 隐藏树状菜单
    onCloseTree() {
      this.$refs.popover.showPopper = false
    },
    // 显示时触发
    onShowPopover() {
      this.showStatus = true
      this.$refs.tree.filter(false)
    },
    // 隐藏时触发
    onHidePopover() {
      this.showStatus = false
      this.$emit('selected', this.valueModel)
    },
    onClearInput() {
      this.valueModel = ''
      this.labelModel = ''
      this.$emit('nodeClick', null)
    },
    // 树节点过滤方法
    filterNode(query, data) {
      if (!query) return true
      return data[this.props.label].indexOf(query) !== -1
    },
    // 搜索树状数据中的 ID
    getRepoData(repoId) {
      let stark = []
      stark = stark.concat(this.treedata)
      while (stark.length) {
        const temp = stark.shift()
        if (temp[this.props.children]) {
          stark = stark.concat(temp[this.props.children])
        }
        if (temp[this.props.value] === repoId) {
          return temp[this.props.label]
        }
      }
      return null
    },
    // 清除空 children项
    cleanChildren(data) {
      const fa = (list) => {
        list.map((e) => {
          if (e.children.length) {
            fa(e.children)
          } else {
            delete e.children
          }
          return e
        })
        return list
      }
      return fa(data)
    }
  }
}
</script>

<style>
.el-input.el-input--suffix {
  cursor: pointer;
  overflow: hidden;
}
.el-input.el-input--suffix.rotate .el-input__suffix {
  transform: rotate(180deg);
}
.select-tree {
  max-height: 350px;
  overflow-y: scroll;
}
/* 菜单滚动条 */
.select-tree::-webkit-scrollbar {
  z-index: 11;
  width: 6px;
}
.select-tree::-webkit-scrollbar-track,
.select-tree::-webkit-scrollbar-corner {
  background: #fff;
}
.select-tree::-webkit-scrollbar-thumb {
  border-radius: 5px;
  width: 6px;
  background: #b4bccc;
}
.select-tree::-webkit-scrollbar-track-piece {
  background: #fff;
  width: 6px;
}
</style>

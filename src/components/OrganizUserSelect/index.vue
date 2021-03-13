<template>
  <el-select
    v-model="currentValue"
    filterable
    :multiple="multi"
    reserve-keyword
    :style="`width: ${width}px`"
    clearable
    automatic-dropdown
    placeholder="选择或搜索用户"
    class="filter-item"
    @change="handlerChange"
  >
    <el-option
      v-for="item in dataList"
      :key="item.id"
      :label="item.username"
      :value="item.id"
    />
  </el-select>
</template>
<script>

import { mapGetters } from 'vuex'
import { listOrganizUser } from '@/views/platform/user/user'

export default {
  name: 'OrganizUserSelect',
  props: {
    multi: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => ([])
    },
    default: {
      type: Number,
      default: 0
    },
    // 输入框宽度
    width: {
      type: Number,
      default: 200
    },
    showAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 下拉选项值
      dataList: [],
      currentValue: []
    }
  },
  computed: {
    ...mapGetters(['ananUserInfo'])
  },
  watch: {
    // 检测查询变化
    value: {
      handler() {
        this.currentValue = this.value
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      listOrganizUser(this.ananUserInfo.organizId).then(response => {
        this.dataList = response.data
        if (!this.showAll) {
          this.dataList = this.dataList.filter(value => value.status === 0)
        }
      }).catch((reason) => {
        this.$notify({
          title: '获取机构用户数据失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    handlerChange(repoId) {
      this.$emit('change', repoId)
      this.$emit('input', repoId)
    }
  }
}
</script>

<template>
  <el-select
    v-model="currentValue"
    filterable
    remote
    :multiple="multi"
    reserve-keyword
    clearable
    automatic-dropdown
    placeholder="选择或搜索用户"
    :remote-method="fetchData"
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
      type: String,
      default: ''
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
  created() {
    this.currentValue = this.value
    this.fetchData()
  },
  methods: {
    fetchData() {
      listOrganizUser(this.ananUserInfo.organizId).then(response => {
        this.dataList = response.data
        this.currentValue = this.value
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

<template>
  <el-select
    v-model="currentValue"
    filterable
    remote
    :multiple="multi"
    reserve-keyword
    clearable
    automatic-dropdown
    placeholder="选择或搜索题库"
    :remote-method="fetchData"
    class="filter-item"
    @change="handlerChange"
  >
    <el-option
      v-for="item in dataList"
      :key="item.id"
      :label="item.title"
      :value="item.id"
    />
  </el-select>
</template>
<script>

import { fetchRepoList } from '@/views/exam/qu/repo/repo'

export default {
  name: 'RepoSelect',
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
      const data = {
        'sortRules': [
          {
            'sortName': 'code',
            'sortOrder': 'ASC'
          }
        ]
      }
      fetchRepoList(data).then(response => {
        this.dataList = response.data.data
      }).catch((reason) => {
        this.$notify({
          title: '获取题库数据失败',
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

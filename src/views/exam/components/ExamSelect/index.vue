<template>

  <el-select
    v-model="currentValue"
    filterable
    remote
    :multiple="multi"
    clearable
    placeholder="选择或搜索考试"
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

import { fetchList } from '@/views/exam/exam/exam'

export default {
  name: 'ExamSelect',
  props: {
    multi: Boolean,
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
      fetchList().then(response => {
        this.dataList = response.data.data
      }).catch((reason) => {
        this.$notify({
          title: '获取考试数据失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    handlerChange(e) {
      this.$emit('change', e)
      this.$emit('input', e)
    }
  }
}
</script>

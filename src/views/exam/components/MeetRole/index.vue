<template>

  <el-select
    v-model="values"
    style="width: 100%"
    multiple
    filterable
    remote
    reserve-keyword
    clearable
    automatic-dropdown
    placeholder="请选择角色"
    :remote-method="fetchList"
    @change="handlerChange"
  >
    <el-option
      v-for="item in list"
      :key="item.id"
      :label="item.title"
      :value="item.id"
    />
  </el-select>

</template>

<script>

import { fetchList } from '@/views/exam/sys/role/role'

export default {
  name: 'MeetRole',
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    default: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      // 下拉选项值
      list: [],
      values: []
    }
  },

  watch: {
    // 检测查询变化
    value: {
      handler() {
        this.values = this.value
      },
      deep: true
    }
  },
  created() {
    this.values = this.value
    this.fetchList()
  },
  methods: {

    fetchList() {
      fetchList().then(response => {
        this.list = response.data.data
      })
    },
    handlerChange(e) {
      this.$emit('change', e)
      this.$emit('input', e)
    }
  }
}
</script>

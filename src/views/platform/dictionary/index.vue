<template>
  <div class="dashboard-container">
    <!--<div class="app-container calendar-list-container">-->
    <el-row>
      <el-col :span="11">
        <dictionaryHeader @dic-row-click="onDicHeaderRowClick" />
      </el-col>
      <el-col :span="13">
        <dictionaryDetail ref="dictionaryDetail" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DictionaryHeader from './component/DictionaryHeader'
import DictionaryDetail from './component/DictionaryDetail'

export default {
  name: 'ConfigDictionary',
  components: {
    DictionaryHeader,
    DictionaryDetail
  },
  filters: {},
  data() {
    return {
    }
  },
  methods: {
    onDicHeaderRowClick(row) {
      this.$refs.dictionaryDetail.getList(row)
    }
  }
}
</script>

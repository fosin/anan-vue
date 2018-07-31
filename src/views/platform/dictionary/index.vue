<template>
  <div class="dashboard-container">
  <!--<div class="app-container calendar-list-container">-->
    <el-row>
      <el-col :span="11">
        <dictionaryHeader  v-on:dic-row-click="onDicHeaderRowClick"></dictionaryHeader>
      </el-col>
      <el-col :span="13">
        <dictionaryDetail ref="dictionaryDetail"></dictionaryDetail>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import DictionaryHeader from './component/DictionaryHeader'
  import DictionaryDetail from './component/DictionaryDetail'

  export default {
    name: 'config_dictionary',
    components: {
      DictionaryHeader,
      DictionaryDetail
    },
    data() {
      return {
      }
    },
    filters: {},
    methods: {
      onDicHeaderRowClick(row) {
        this.$refs.dictionaryDetail.getList(row)
      }
    }
  }
</script>

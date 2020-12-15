<template>
  <div class="dashboard-container">
    <!--<div class="app-container calendar-list-container">-->
    <el-row>
      <el-col :span="11">
        <International @dic-row-click="onDicHeaderRowClick" />
      </el-col>
      <el-col :span="13">
        <Charset ref="charset" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import International from './international.vue'
import Charset from './charset.vue'

export default {
  name: 'InternationalAndCharset',
  components: {
    International,
    Charset
  },
  filters: {},
  data() {
    return {
    }
  },
  methods: {
    onDicHeaderRowClick(row) {
      this.$refs.charset.getList(row)
    }
  }
}
</script>

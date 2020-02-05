<template>
  <div>
    <el-container>
      <el-header style="text-align: left;padding-left: 0px;margin-top: 10px">
        <el-tag size="medium">
          请选择部门:
        </el-tag>
        <el-select v-model="depId" size="mini" placeholder="请选择">
          <el-option
            v-for="item in deps"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-header>
      <el-main>Main</el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      depId: 1,
      deps: []
    }
  },
  mounted: function() {
    this.loadDeps()
  },
  methods: {
    loadDeps() {
      this.getRequest('gateway/vhr/salary/table/deps').then(resp => {
        if (resp && resp.status === 200) {
          this.deps = resp.data
        }
      })
    }
  }
}
</script>

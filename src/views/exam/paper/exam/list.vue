<template>
  <data-table
    ref="pagingTable"
    :options="options"
    :list-query="listQuery"
  >
    <template slot="filter-content">
      <el-select v-model="listQuery.params.openType" class="filter-item" placeholder="开放类型" clearable>
        <el-option
          v-for="item in openTypes"
          :key="item.name"
          :label="item.value"
          :value="item.name"
        />
      </el-select>
      <el-input v-model="listQuery.params.title" placeholder="搜索考试名称" style="width: 200px;" class="filter-item" />
    </template>
    <template slot="data-columns">

      <el-table-column
        label="考试名称"
        prop="title"
        show-overflow-tooltip
      />
      <el-table-column
        label="考试类型"
        align="center"
      >
        <template slot-scope="scope">
          {{ getDicDetailValue(openTypes, scope.row.openType) }}
        </template>
      </el-table-column>
      <el-table-column
        label="考试时间"
        width="220px"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.timeLimit">
            {{ scope.row.startTime }} ~ {{ scope.row.endTime }}
          </span>
          <span v-else>不限时</span>
        </template>
      </el-table-column>
      <el-table-column
        label="考试时长"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.totalTime }}分钟
        </template>
      </el-table-column>
      <el-table-column
        label="考试总分"
        prop="totalScore"
        align="center"
      />
      <el-table-column
        label="及格线"
        prop="qualifyScore"
        align="center"
      />
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.state===0" icon="el-icon-caret-right" type="primary" size="mini" @click="handlePre(scope.row.id)">去考试</el-button>
          <el-button v-if="scope.row.state===1" icon="el-icon-s-release" size="mini" disabled>已禁用</el-button>
          <el-button v-if="scope.row.state===2" icon="el-icon-s-fold" size="mini" disabled>待开始</el-button>
          <el-button v-if="scope.row.state===3" icon="el-icon-s-unfold" size="mini" disabled>已结束</el-button>
        </template>
      </el-table-column>
    </template>
  </data-table>
</template>

<script>
import DataTable from '@/views/exam/components/DataTable'

export default {
  name: 'OnlineList',
  components: { DataTable },
  data() {
    return {
      openTypes: [],
      listQuery: {
        current: 1,
        size: 10,
        params: {
        }
      },
      options: {
        // 可批量操作
        multi: false,
        // 列表请求URL
        listUrl: 'gateway/exam/api/exam/exam/online-paging'
      }
    }
  },
  created() {
    this.$store.dispatch('LoadDictionaryById', 144).then(res => {
      this.openTypes = res.details
    }).catch((error) => {
      this.$notify({
        title: '加载字典开放类型失败',
        message: error.message,
        type: 'error',
        duration: 5000
      })
    })
  },
  methods: {
    // 开始考试
    handlePre(examId) {
      this.$router.push({ name: 'PreExam', params: { examId: examId }})
    }
  }
}
</script>

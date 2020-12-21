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
      <el-date-picker
        v-model="listQuery.params.startTime"
        class="filter-item"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="考试开始时间"
      />
      <el-date-picker
        v-model="listQuery.params.endTime"
        class="filter-item"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="考试结束时间"
      />
      <el-input v-model="listQuery.params.title" placeholder="搜索考试名称" style="width: 200px;" class="filter-item" />
    </template>
    <template slot="data-columns">
      <el-table-column
        label="考试名称"
        prop="title"
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
        label="状态"
        align="center"
      >
        <template slot-scope="scope">
          {{ getDicDetailValue(examStates, scope.row.state) }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="220px"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdateExam(scope.row.id)">修改</el-button>
          <el-button type="warning" size="mini" icon="el-icon-user" @click="handleExamDetail(scope.row.id)">考试详情</el-button>
        </template>
      </el-table-column>
    </template>
  </data-table>
</template>

<script>
import DataTable from '@/views/exam/components/DataTable'

export default {
  name: 'ExamList',
  components: { DataTable },
  data() {
    return {
      openTypes: [],
      examStates: [],
      listQuery: {
        current: 1,
        size: 10,
        params: {
          title: ''
        }
      },
      options: {
        // 可批量操作
        multi: true,
        // 批量操作列表
        multiActions: [
          {
            value: 'delete',
            label: '删除'
          }, {
            value: 'enable',
            label: '启用'
          },
          {
            value: 'disable',
            label: '禁用'
          }
        ],
        // 列表请求URL
        listUrl: 'gateway/exam/api/exam/exam/paging',
        // 删除请求URL
        deleteUrl: 'gateway/exam/api/exam/exam/delete',
        // 删除请求URL
        stateUrl: '/exam/exam/state',
        addRoute: 'AddExam'
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
    this.$store.dispatch('LoadDictionaryById', 145).then(res => {
      this.examStates = res.details
    }).catch((error) => {
      this.$notify({
        title: '加载字典考试状态失败',
        message: error.message,
        type: 'error',
        duration: 5000
      })
    })
  },
  methods: {
    handleExamDetail(examId) {
      this.$router.push({ name: 'ListExamUser', params: { examId: examId }})
    },
    handleUpdateExam(examId) {
      this.$router.push({ name: 'UpdateExam', params: { id: examId }})
    }
  }
}
</script>

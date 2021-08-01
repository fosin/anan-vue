<template>
  <data-table
    ref="pagingTable"
    :options="options"
    :list-query="listQuery"
  >
    <template slot="filter-content">
      <el-button
        v-if="examData.wrongTrain"
        class="filter-item"
        style="float: right"
        type="warning"
        round
        icon="el-icon-magic-stick"
        @click="startTrain"
      >
        错题训练
      </el-button>
    </template>
    <template slot="data-columns">
      <el-table-column
        label="试题内容"
        prop="title"
        sortable="custom"
        :sort-orders="['ascending','descending']"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <router-link :to="{ name: 'ExamOnlineViewQu', params:{ id: scope.row.quId}}">
            {{ scope.row.title }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        label="错误次数"
        prop="wrong_count"
        sortable="custom"
        :sort-orders="['ascending','descending']"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          {{ scope.row.wrongCount }}
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="update_time"
        sortable="custom"
        :sort-orders="['ascending','descending']"
        width="160px"
      >
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
    </template>
  </data-table>
</template>

<script>
import DataTable from '@/views/exam/components/DataTable'
import { fetchDetail } from '@/views/exam/exam/exam'

export default {
  name: 'ExamOnlineResultsRecords',
  components: { DataTable },
  data() {
    return {
      listQuery: {
        current: 1,
        size: 10,
        params: {
          title: '',
          examId: ''
        },
        sort: {
          sortOrder: 'DESC',
          sortName: 'update_time'
        },
        search: {
          column: 'title',
          input: '',
          placeholder: '搜索题库名称'
        }
      },
      examData: {},
      options: {
        // 可批量操作
        multi: true,
        // 批量操作列表
        multiActions: [
          {
            value: 'delete',
            label: this.$t('table.delete')
          }
        ],
        // 列表请求URL
        listUrl: 'gateway/exam/api/user/wrong-book/paging',
        // 删除请求URL
        deleteUrl: 'gateway/exam/api/user/wrong-book/delete'
      }
    }
  },
  created() {
    const id = this.$route.params.examId
    if (typeof id !== 'undefined') {
      this.listQuery.params.examId = id
      this.fetchExamData(id)
    }
  },
  methods: {
    startTrain() {
      this.$store.dispatch('closeAndPushToView', { name: 'ExamOnlineResultsTraining', params: { examId: this.listQuery.params.examId }})
    },
    fetchExamData(id) {
      fetchDetail(id).then(response => {
        this.examData = response.data
      }).catch((reason) => {
        this.$notify({
          title: '获取考试数据失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    }
  }
}
</script>

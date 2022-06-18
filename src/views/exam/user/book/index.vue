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
        prop="wrongCount"
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
        prop="updateTime"
        sortable="custom"
        :sort-orders="['ascending','descending']"
        width="160px"
      />
    </template>
  </data-table>
</template>

<script>
import DataTable from '@/components/DataTable'
import { fetchDetail } from '@/views/exam/exam/exam'

export default {
  name: 'ExamOnlineResultsRecords',
  components: { DataTable },
  data() {
    return {
      examData: {},
      listQuery: {
        listUrl: 'gateway/exam/api/user/wrong-book/paging',
        pageSizes: [5, 10, 25, 50, 100],
        search: {
          input: null,
          cols: ['title'],
          placeholder: '搜索考试名称'
        },
        pageModule: {
          pageNumber: 1,
          pageSize: 10,
          params: {
            title: null,
            examId: null,
            queryRule: {
              logiOperator: 'and',
              relaRules: [
                {
                  fieldName: 'title',
                  relaOperator: 'like'
                },
                {
                  fieldName: 'examId',
                  relaOperator: 'eq'
                }
              ]
            },
            sortRules: [{
              sortName: 'updateTime',
              sortOrder: 'DESC'
            }
            ]
          }
        }
      },
      options: {
        // 可批量操作
        multi: true,
        // 批量操作列表
        multiActions: [
          {
            value: 'delete',
            label: this.$t('table.delete'),
            url: 'gateway/exam/api/user/wrong-book/ids',
            method: 'delete',
            permissionId: '0',
            confirm: true
          }
        ],
        addAction: {
          enable: false
        },
        tableRowClass: {
          column: 'state',
          data: [
            {
              key: 1,
              value: 'info-row'
            }
          ]
        }
      }
    }
  },
  created() {
    const id = this.$route.params.examId
    if (typeof id !== 'undefined') {
      this.listQuery.pageModule.params.examId = id
      this.fetchExamData(id)
    }
  },
  methods: {
    startTrain() {
      this.$store.dispatch('closeAndPushToView', { name: 'ExamOnlineResultsTraining', params: { examId: this.listQuery.pageModule.params.examId }})
    },
    fetchExamData(id) {
      fetchDetail(id, '0').then(response => {
        this.examData = response.data.data
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

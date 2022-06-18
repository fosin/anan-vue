<template>
  <div>
    <data-table
      ref="pagingTable"
      :options="options"
      :list-query="listQuery"
    >
      <template slot="data-columns">
        <el-table-column
          label="考试名称"
          prop="title"
          sortable="true"
          align="center"
        />
        <el-table-column
          label="考试次数"
          prop="tryCount"
          align="center"
          width="100px"
        >
          <template slot-scope="scope">
            {{ scope.row.tryCount }}
          </template>
        </el-table-column>
        <el-table-column
          label="最高分"
          prop="maxScore"
          align="center"
          width="100px"
        >
          <template slot-scope="scope">
            {{ scope.row.maxScore }}
          </template>
        </el-table-column>
        <el-table-column
          label="最高评级"
          align="center"
          prop="rank"
          sortable="true"
          width="120px"
        >
          <template slot-scope="scope">
            <span :style="{ color: rankColor[scope.row.rank] }">{{ getAnanDicValue(rankDics, scope.row.rank) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="初考时间"
          prop="createTime"
          align="center"
          sortable="true"
          width="160px"
        />
        <el-table-column
          label="最后考试时间"
          prop="updateTime"
          align="center"
          sortable="true"
          width="160px"
        />
        <el-table-column
          label="操作"
          align="center"
          width="180px"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              round
              icon="el-icon-view"
              @click="handleExamDetail(scope.row.examId)"
            >详情</el-button>
            <el-button
              v-if="scope.row.showResult"
              type="warning"
              size="mini"
              round
              icon="el-icon-close"
              @click="handlerExamBook(scope.row.examId)"
            >错题</el-button>
          </template>
        </el-table-column>
      </template>
    </data-table>

    <el-dialog title="考试明细" :visible.sync="dialogVisible" width="60%">
      <div v-if="dialogVisible" class="el-dialog-div">
        <my-paper-list :exam-id="examId" :user-id="ananUserInfo.id" show-all="0" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import { mapGetters } from 'vuex'
import MyPaperList from './paper'

export default {
  name: 'ExamOnlineResults',
  components: { MyPaperList, DataTable },
  data() {
    return {
      rankDics: [],
      rankColor: {
        0: '#ff0000',
        1: '#00ff00',
        2: '#0000FF',
        3: '#FF00FF',
        4: '#ff8000'
      },
      dialogVisible: false,
      examId: '',
      listQuery: {
        listUrl: 'gateway/exam/api/user/exam/paging',
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
            userId: 0,
            queryRule: {
              logiOperator: 'and',
              relaRules: [
                {
                  fieldName: 'title',
                  relaOperator: 'like'
                },
                {
                  fieldName: 'userId',
                  relaOperator: 'eq'
                }
              ]
            },
            sortRules: [{
              sortName: 'title',
              sortOrder: 'ASC'
            }
            ]
          }
        }
      },
      options: {
        // 可批量操作
        multi: false,
        // 批量操作列表
        multiActions: [],
        addAction: {
          enable: false
        },
        tableRowClass: {
          column: 'status',
          data: [
            {
              key: 1,
              value: 'info-row'
            },
            {
              key: 9,
              value: 'info-row'
            }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'ananUserInfo'
    ])
  },
  created() {
    this.loadDictionaryById(148).then(res => {
      this.rankDics = res.details
    })
    this.listQuery.pageModule.params.userId = this.ananUserInfo.id
  },
  methods: {
    // 考试明细
    handleExamDetail(examId) {
      this.examId = examId
      this.dialogVisible = true
    },
    handlerExamBook(examId) {
      this.$store.dispatch('pushToView', { name: 'ExamOnlineResultsRecords', params: { examId: examId }})
    }
  }
}
</script>

<style scoped>
  .el-dialog-div{
    height: 60vh;
    overflow: auto;
    padding: 10px;
  }
</style>

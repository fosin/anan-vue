<template>
  <div>
    <data-table
      ref="pagingTable"
      :options="options"
      :list-query="listQuery"
    >
      <template slot="filter-content">
        <el-input v-model="listQuery.params.realName" placeholder="搜索人员" style="width: 200px;" class="filter-item" />
      </template>
      <template slot="data-columns">
        <el-table-column
          label="人员"
          prop="realName"
          align="center"
        />
        <el-table-column
          label="考试次数"
          prop="tryCount"
          align="center"
        />
        <el-table-column
          label="最高分"
          prop="maxScore"
          align="center"
        />
        <el-table-column
          label="是否通过"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.passed" style="color: #00ff00;">通过</span>
            <span v-else style="color: #ff0000;">未通过</span>
          </template>
        </el-table-column>
        <el-table-column
          label="最后考试时间"
          prop="updateTime"
          align="center"
        />
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-view" @click="handleExamDetail(scope.row.examId, scope.row.userId)">考试明细</el-button>
          </template>
        </el-table-column>
      </template>
    </data-table>
    <el-dialog title="考试明细" :visible.sync="dialogVisible" width="60%">
      <div class="el-dialog-div">
        <my-paper-list :exam-id="examId" :user-id="userId" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DataTable from '@/views/exam/components/DataTable'
import MyPaperList from './paper'
import { mapGetters } from 'vuex'

export default {
  name: 'ExamManagementExamUsers',
  components: { MyPaperList, DataTable },
  data() {
    return {
      dialogVisible: false,
      examId: '',
      userId: '',
      // organizUsers: [],
      listQuery: {
        current: 1,
        size: 10,
        params: {
          examId: '',
          realName: ''
        },
        search: {
          column: '',
          placeholder: ''
        }
      },
      options: {
        // 可批量操作
        multi: false,
        // 列表请求URL
        listUrl: 'gateway/exam/api/user/exam/paging'
      }
    }
  },
  computed: {
    ...mapGetters([
      'ananUserInfo'
    ])
  },
  created() {
    this.listQuery.params.examId = this.$route.params.examId
    // this.postRequest('gateway/platform/v1/user/childList/organizId/' + this.ananUserInfo.organizId).then(res => {
    //   this.organizUsers = res.data
    // })
  },
  methods: {
    // getUserName(userId) {
    //   if (this.organizUsers) {
    //     for (let i = 0; i < this.organizUsers.length; i++) {
    //       const user = this.organizUsers[i]
    //       if (user.id === userId) {
    //         return user.username
    //       }
    //     }
    //   }
    // },
    // 开始考试
    handleExamDetail(examId, userId) {
      this.examId = examId
      this.userId = userId
      this.dialogVisible = true
    },
    handlerExamBook(examId) {
      this.$store.dispatch('closeAndPushToView', { name: 'ExamOnlineResultsRecords', params: { examId: examId }})
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

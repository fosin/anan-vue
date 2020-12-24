<template>
  <div>
    <data-table
      ref="pagingTable"
      :options="options"
      :list-query="listQuery"
    >
      <template slot="filter-content" style="display: flex; align-items: flex-start">
        <exam-select v-model="listQuery.params.examId" class="filter-item" />
        <depart-tree-select v-model="listQuery.params.departId" class="el-select filter-item el-select--medium " :options="treeData" :props="defaultProps" width="200px" />
        <el-select v-model="listQuery.params.state" placeholder="考试状态" class="filter-item" clearable>
          <el-option
            v-for="item in paperStates"
            :key="item.name"
            :label="item.value"
            :value="item.name"
          />
        </el-select>
      </template>
      <template slot="data-columns">
        <el-table-column
          label="考试名称"
          align="center"
          prop="title"
        >
          <template slot-scope="scope">
            <router-link :to="{ name: 'ExamOnlineDoResult', params: {id : scope.row.id}}">
              {{ scope.row.title }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          label="人员"
          align="center"
          prop="userId_dictText"
        />
        <el-table-column
          label="部门"
          align="center"
          prop="departId_dictText"
        />
        <el-table-column
          label="考试时长(分钟)"
          align="center"
          prop="totalTime"
        >
          <template slot-scope="scope">
            {{ scope.row.userTime }} / {{ scope.row.totalTime }}
          </template>
        </el-table-column>

        <!--      <el-table-column-->
        <!--        label="客观分"-->
        <!--        align="center"-->
        <!--        prop="subjScore"-->
        <!--      />-->

        <!--      <el-table-column-->
        <!--        label="主观分"-->
        <!--        align="center"-->
        <!--        prop="objScore"-->
        <!--      />-->

        <el-table-column
          label="考试得分"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.userScore }} / {{ scope.row.totalScore }}
          </template>
        </el-table-column>
        <el-table-column
          label="考试时间"
          align="center"
          prop="createTime"
          width="180px"
        />
        <el-table-column
          label="考试结果"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.state===1">待阅卷</span>
            <span v-else-if="scope.row.state===0">待交卷</span>
            <span v-else>
              <span v-if="scope.row.userScore >= scope.row.qualifyScore" style="color:#00ff00">合格</span>
              <span v-else style="color: #ff0000">不合格</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="考试状态"
          align="center"
        >
          <template slot-scope="scope">
            {{ getDicDetailValue(paperStates, scope.row.state) }}
          </template>
        </el-table-column>
        <el-table-column
          label="视频截图"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleCapture(scope.row.id)">考试截图</el-button>
          </template>
        </el-table-column>
      </template>
    </data-table>
    <el-dialog title="考试截图" :visible.sync="dialogVisible" width="500px">
      <img v-for="item in captureList" :key="item.capture" :src="item.capture" style="width: 230px">
    </el-dialog>
  </div>
</template>

<script>
import DataTable from '@/views/exam/components/DataTable'
import DepartTreeSelect from '@/views/exam/components/DepartTreeSelect'
import { fetchTree } from '../../sys/depart/depart'
import { listCaptures } from './paper'
import ExamSelect from '@/views/exam/components/ExamSelect'

export default {
  name: 'ExamManagementExamPaper',
  components: { ExamSelect, DepartTreeSelect, DataTable },
  data() {
    return {

      dialogVisible: false,

      captureList: [],

      paperStates: [
        { value: 0, label: '考试中' },
        { value: 1, label: '待阅卷' },
        { value: 2, label: '已考完' },
        { value: 3, label: '!已弃考' }
      ],
      treeData: [],
      defaultProps: {
        value: 'id',
        label: 'deptName',
        children: 'children'
      },

      listQuery: {
        current: 1,
        size: 10,
        params: {
          examId: ''
        }
      },

      options: {

        // 可批量操作
        multi: false,
        // 列表请求URL
        listUrl: 'gateway/exam/api/paper/paper/paging'
      }
    }
  },

  created() {
    const examId = this.$route.params.examId

    if (typeof examId !== 'undefined') {
      this.listQuery.params.examId = examId
    }
    this.$store.dispatch('LoadDictionaryById', 143).then(res => {
      this.paperStates = res.details
    }).catch((error) => {
      this.$notify({
        title: '加载字典试卷状态失败',
        message: error.message,
        type: 'error',
        duration: 5000
      })
    })
    fetchTree({}).then(response => {
      this.treeData = response.data
    })
  },
  methods: {

    handleCapture(paperId) {
      this.dialogVisible = true
      listCaptures(paperId).then(res => {
        this.captureList = res.data
      })
    }
  }
}
</script>

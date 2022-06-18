<template>
  <div>
    <data-table
      ref="pagingTable"
      :options="options"
      :list-query="listQuery"
    >
      <template slot="filter-content">
        <el-radio-group v-model="listQuery.pageModule.params.state" style="margin-left: 20px;margin-top: 5px;" @change="stateChanged()">
          <el-radio
            v-for="item in paperStates"
            :key="item.name"
            :label="item.name"
          >{{ item.value }}
          </el-radio>
        </el-radio-group>
      </template>
      <template slot="data-columns">
        <el-table-column
          label="考试名称"
          align="center"
          prop="title"
          width="250px"
          sortable="custom"
          :sort-orders="['ascending','descending']"
        />
        <el-table-column
          label="部门"
          align="center"
          width="150px"
          prop="depart_id"
          sortable="custom"
          :sort-orders="['ascending','descending']"
        >
          <template slot-scope="scope">
            {{ scope.row.departName }}
          </template>
        </el-table-column>
        <el-table-column
          label="人员"
          align="center"
          width="110px"
          prop="user_id"
          sortable="custom"
          :sort-orders="['ascending','descending']"
        >
          <template slot-scope="scope">
            {{ scope.row.realName }}
          </template>
        </el-table-column>
        <el-table-column
          label="用时"
          align="center"
          width="100px"
          prop="user_time"
          sortable="custom"
          :sort-orders="['ascending','descending']"
        >
          <template slot-scope="scope">
            {{ scope.row.userTime }} / {{ scope.row.totalTime }}分钟
          </template>
        </el-table-column>
        <el-table-column
          label="正确率"
          align="center"
          width="90px"
          prop="accuracy"
          sortable="custom"
          :sort-orders="['ascending','descending']"
        >
          <template slot-scope="scope">
            <span :style="{ color: getAccuracyColor(scope.row) }">{{ scope.row.accuracy }}%</span>
          </template>
        </el-table-column>
        <el-table-column
          label="得分"
          align="center"
          width="95px"
          prop="user_score"
          sortable="custom"
          :sort-orders="['ascending','descending']"
        >
          <template slot-scope="scope">
            {{ scope.row.userScore }} / {{ scope.row.totalScore }}分
          </template>
        </el-table-column>
        <el-table-column
          label="评级"
          align="center"
          width="90px"
          prop="rank"
          sortable="custom"
          :sort-orders="['ascending','descending']"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.state===1">待阅卷</span>
            <span v-else-if="scope.row.state===0">待交卷</span>
            <span v-else>
              <span :style="{ color: rankColor[scope.row.rank] }">{{ getAnanDicValue(rankDics, scope.row.rank) }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          width="90px"
          prop="state"
          sortable="custom"
          :sort-orders="['ascending','descending']"
        >
          <template slot-scope="scope">
            {{ getAnanDicValue(paperStates, scope.row.state) }}
          </template>
        </el-table-column>
        <el-table-column
          label="考试时间"
          align="center"
          width="160px"
          prop="createTime"
          sortable="custom"
          :sort-orders="['ascending','descending']"
        />
        <el-table-column
          label="阅卷时间"
          align="center"
          width="160px"
          prop="reviewTime"
          sortable="custom"
          :sort-orders="['ascending','descending']"
        />
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          width="90px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.state===1 || scope.row.state===2"
              type="primary"
              size="small"
              @click="handleReview(scope.row.id)"
            >去阅卷
            </el-button>
          </template>
        </el-table-column>
        <!--        <el-table-column
          label="视频截图"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleCapture(scope.row.id)">考试截图</el-button>
          </template>
        </el-table-column>-->
      </template>
    </data-table>
    <!--    <el-dialog title="考试截图" :visible.sync="dialogVisible" width="500px">
      <img v-for="item in captureList" :key="item.capture" :src="item.capture" style="width: 230px">
    </el-dialog>-->
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import { treeAllChildOrganiz } from '@/views/platform/organization/organization'
import { mapGetters } from 'vuex'

export default {
  name: 'ExamManagementReview',
  components: { DataTable },
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
      captureList: [],
      paperStates: [
        { value: 0, label: '考试中' },
        { value: 1, label: '待阅卷' },
        { value: 2, label: '已考完' },
        { value: 3, label: '已弃考' }
      ],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      listQuery: {
        listUrl: 'gateway/exam/api/paper/paper/paging',
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
            state: null,
            queryRule: {
              logiOperator: 'and',
              relaRules: [
                {
                  fieldName: 'title',
                  relaOperator: 'like'
                },
                {
                  fieldName: 'state',
                  relaOperator: 'eq'
                }
              ]
            },
            sortRules: [{
              sortName: 'createTime',
              sortOrder: 'DESC'
            }
            ]
          }
        }
      },
      options: {
        // 可批量操作
        multi: false,
        // 批量操作列表
        multiActions: [
          {
            value: 'delete',
            label: this.$t('table.delete'),
            url: 'gateway/exam/api/paper/paper/ids',
            method: 'delete',
            permissionId: '0',
            confirm: true
          }
        ],
        addAction: {
          enable: false,
          route: '',
          permissionId: '0'
        },
        tableRowClass: {
          column: 'state',
          data: [
            {
              key: 1,
              value: 'warning-row'
            }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters(['ananUserInfo'])
  },
  created() {
    this.loadDictionaryById(143).then(res => {
      this.paperStates = res.details
    })
    this.loadDictionaryById(148).then(res => {
      this.rankDics = res.details
    })
    treeAllChildOrganiz(this.ananUserInfo.organizId).then(response => {
      this.treeData = response.data.data || []
    }).catch((reason) => {
      this.$notify({
        title: '获取部门数失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
  },
  methods: {
    getAccuracyColor(data) {
      const qualifyAcc = data.qualifyScore / data.totalScore * 100
      if (qualifyAcc > data.accuracy) {
        return this.rankColor[0]
      } else {
        return '#000000'
      }
    },
    stateChanged(selected) {
      this.$refs.pagingTable.getList()
    },
    handleReview(id) {
      if (!id || id.length < 1) {
        this.$message({
          message: '试卷编号无效!',
          type: 'error'
        })
        return
      }
      this.$store.dispatch('pushToView', { name: 'ExamManagementReviewPaper', params: { paperId: id }})
    },
    handleCapture(paperId) {
      // this.dialogVisible = true
      // listCaptures(paperId).then(res => {
      //   this.captureList = res.data.data
      // })
    }
  }
}
</script>

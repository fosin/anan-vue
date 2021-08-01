<template>
  <data-table
    ref="pagingTable"
    :options="options"
    :list-query="listQuery"
    style="width: 100%"
  >
    <template slot="filter-content">
      <el-select
        v-model="listQuery.params.openType"
        class="filter-item"
        placeholder="开放类型"
        clearable
        style="width: 150px"
      >
        <el-option
          v-for="item in openTypes"
          :key="item.name"
          :label="item.value"
          :value="item.name"
          :disabled="item.status === 1"
        />
      </el-select>
      <el-date-picker
        v-model="listQuery.params.startTime"
        class="filter-item"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="考试开始时间"
        style="width: 150px"
      />
      <el-date-picker
        v-model="listQuery.params.endTime"
        class="filter-item"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="考试结束时间"
        style="width: 150px"
      />
    </template>
    <template slot="data-columns">
      <el-table-column
        label="考试名称"
        prop="title"
        sortable="true"
        width="250px"
      />
      <el-table-column
        label="考试类型"
        align="center"
      >
        <template slot-scope="scope">
          {{ getAnanDicValue(openTypes, scope.row.openType) }}
        </template>
      </el-table-column>
      <el-table-column
        label="考试时间"
        align="center"
        width="170px"
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
        label="合格分"
        prop="qualifyScore"
        align="center"
      />
      <el-table-column
        label="考试限时"
        prop="totalTime"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            type="warning"
            disable-transitions
          >{{ scope.row.totalTime }}分钟</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="限考次数"
        prop="allowTimes"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.allowTimes > 0"
            type="warning"
            disable-transitions
          >{{ scope.row.allowTimes }}次</el-tag>
          <el-tag
            v-else
            type="primary"
            disable-transitions
          >不限次</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
      >
        <template slot-scope="scope">
          {{ getAnanDicValue(examStates, scope.row.state) }}
        </template>
      </el-table-column>
      <el-table-column
        label="错题训练"
        prop="wrongTrain"
        align="center"
      >
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.wrongTrain" />
        </template>
      </el-table-column>
      <el-table-column
        label="查看试卷"
        prop="showPaper"
        align="center"
      >
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.showPaper" />
        </template>
      </el-table-column>
      <el-table-column
        label="查看对错"
        prop="showResult"
        align="center"
      >
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.showResult" />
        </template>
      </el-table-column>
      <el-table-column
        label="查看答案"
        prop="showAnswer"
        align="center"
      >
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.showAnswer" />
        </template>
      </el-table-column>
      <el-table-column
        label="允许复制"
        prop="paperCopy"
        align="center"
      >
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.paperCopy" />
        </template>
      </el-table-column>
      <el-table-column
        label="切屏次数"
        prop="ssCount"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.ssCount > 0"
            type="primary"
            disable-transitions
          >{{ scope.row.ssCount }}次</el-tag>
          <el-tag
            v-else
            type="primary"
            disable-transitions
          >不限次</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="拍照频率"
        prop="photoFrequency"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            type="primary"
            disable-transitions
          >{{ scope.row.photoFrequency }}秒</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.updateBy.label')" align="center" prop="updateBy" width="100px">
        <template slot-scope="scope">
          <span>{{ getDicValue(organizTopUsers,"id",scope.row.updateBy,"username") }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.updateTime.label')" width="160px" align="center" prop="update_time" sortable="true">
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
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
import { listUserByTopId } from '@/views/platform/user/user'

export default {
  name: 'ExamManagementExam',
  components: { DataTable },
  data() {
    return {
      openTypes: [],
      examStates: [],
      organizTopUsers: [],
      listQuery: {
        current: 1,
        size: 10,
        params: {
          title: ''
        },
        sort: {
          sortOrder: 'ASC',
          sortName: 'title'
        },
        search: {
          column: 'title',
          input: '',
          placeholder: '搜索考试名称'
        }
      },
      options: {
        // 可批量操作
        multi: true,
        // 批量操作列表
        multiActions: [
          {
            value: 'delete',
            label: this.$t('table.delete')
          }, {
            value: 'enable',
            label: this.$t('table.enable')
          },
          {
            value: 'disable',
            label: this.$t('table.disable')
          }
        ],
        // 列表请求URL
        listUrl: 'gateway/exam/api/exam/exam/paging',
        // 删除请求URL
        deleteUrl: 'gateway/exam/api/exam/exam/delete',
        // 删除请求URL
        stateUrl: 'gateway/exam/api/exam/exam/field/state',
        addRoute: 'ExamManagementExamAdd'
      }
    }
  },
  created() {
    listUserByTopId().then(response => {
      this.organizTopUsers = response.data
    }).catch(reason => {
      this.$notify({
        title: '获取所有用户失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
    this.loadDictionaryById(144).then(res => {
      this.openTypes = res.details
    })
    this.loadDictionaryById(145).then(res => {
      this.examStates = res.details
    })
  },
  methods: {
    handleExamDetail(examId) {
      this.$store.dispatch('pushToView', { name: 'ExamManagementExamUsers', params: { examId: examId }})
    },
    handleUpdateExam(examId) {
      this.$store.dispatch('pushToView', { name: 'ExamManagementExamUpdate', params: { id: examId }})
    }
  }
}
</script>

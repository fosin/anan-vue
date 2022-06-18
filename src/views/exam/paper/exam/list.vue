<template>
  <data-table
    ref="pagingTable"
    :options="options"
    :list-query="listQuery"
  >
    <template slot="filter-content">
      <el-select v-model="listQuery.pageModule.params.openType" class="filter-item" placeholder="开放类型" clearable>
        <el-option
          v-for="item in openTypes"
          :key="item.name"
          :label="item.value"
          :value="item.name"
          :disabled="item.status === 1"
        />
      </el-select>
    </template>
    <template slot="data-columns">
      <el-table-column
        label="考试名称"
        prop="title"
        align="center"
        show-overflow-tooltip
        sortable="true"
        width="250px"
      />
      <el-table-column
        label="考试类型"
        prop="open_type"
        sortable="true"
        align="center"
      >
        <template slot-scope="scope">
          {{ getAnanDicValue(openTypes, scope.row.openType) }}
        </template>
      </el-table-column>
      <el-table-column
        label="考试时间"
        width="170px"
        prop="start_time"
        sortable="true"
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
        prop="total_time"
        sortable="true"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.totalTime }}分钟
        </template>
      </el-table-column>
      <el-table-column
        label="考试总分"
        prop="total_score"
        sortable="true"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.totalScore }}
        </template>
      </el-table-column>
      <el-table-column
        label="合格分"
        prop="qualify_score"
        sortable="true"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.qualifyScore }}
        </template>
      </el-table-column>
      <el-table-column
        label="考试次数"
        prop="allow_times"
        sortable="true"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.allowTimes > 0">
            {{ scope.row.allowTimes }}
          </span>
          <span v-else>不限</span>
        </template>
      </el-table-column>
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
import DataTable from '@/components/DataTable'

export default {
  name: 'ExamOnlineDo',
  components: { DataTable },
  data() {
    return {
      openTypes: [],
      listQuery: {
        listUrl: 'gateway/exam/api/exam/exam/online-paging',
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
            openType: null,
            queryRule: {
              logiOperator: 'and',
              relaRules: [
                {
                  fieldName: 'title',
                  relaOperator: 'like'
                },
                {
                  fieldName: 'openType',
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
          enable: false,
          route: '',
          permissionId: '0'
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
  created() {
    this.loadDictionaryById(144).then(res => {
      this.openTypes = res.details
    })
  },
  methods: {
    // 开始考试
    handlePre(examId) {
      this.$store.dispatch('closeAndPushToView', { name: 'ExamOnlineDoPrepare', params: { examId: examId }})
    }
  }
}
</script>

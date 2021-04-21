<template>
  <div>
    <div style="margin-top: 10px">
      <el-input
        v-model="listQuery.params.title"
        style="width: 200px;"
        class="filter-item"
        placeholder="输入考试名称查找"
        @keyup.enter.native="handleSearch"
      />
      <el-button
        v-waves
        round
        class="filter-item"
        style="margin-left: 5px;"
        type="primary"
        size="small"
        icon="el-icon-search"
        @click="handleSearch"
      >
        {{ $t('table.search') }}
      </el-button>
      <el-date-picker
        v-model="listQuery.params.beginCreateTime"
        class="filter-item"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="考试开始时间"
      />
      <el-date-picker
        v-model="listQuery.params.endCreateTime"
        class="filter-item"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="考试结束时间"
      />
    </div>
    <div style="margin-top: 10px">
      <el-table
        ref="paperRateCount"
        :data="dataList.records"
        border
        fit
        highlight-current-row
        style="width: 100%"
        :default-sort="{prop: 'title', order: 'ascending'}"
      >
        <el-table-column
          label="考试名称"
          prop="title"
          align="center"
          width="250px"
        />
        <el-table-column
          label="考试人数"
          align="center"
          prop="userCount"
          width="170px"
        />
        <el-table-column
          label="通过人数"
          prop="userPassCount"
          align="center"
        />
        <el-table-column
          label="人数通过率"
          prop="userPassRate"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              type="warning"
              disable-transitions
            >{{ scope.row.userPassRate }}%</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="总人次"
          prop="paperCount"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              type="warning"
              disable-transitions
            >{{ scope.row.paperCount }}次</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="通过人次"
          prop="paperPassCount"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              type="warning"
              disable-transitions
            >{{ scope.row.paperPassCount }}次</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="人次通过率"
          prop="paperPassRate"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              type="warning"
              disable-transitions
            >{{ scope.row.paperPassRate }}%</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="!listLoading && dataList.total>0" class="pagination-container">
      <el-pagination
        :current-page.sync="listQuery.current"
        :page-sizes="listQuery.pageSizes"
        :page-size="listQuery.size"
        :total="dataList.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: 'ExamQueryPaperRate',
  data() {
    return {
      // 试题列表
      dataList: [],
      listQuery: {
        current: 1,
        size: 10,
        params: {
          title: '',
          beginCreateTime: null,
          endCreateTime: null
        }
      },
      openTypes: []
    }
  },
  created() {
    // this.loadDictionaryById(144).then(res => {
    //   this.openTypes = res.details
    // })
    // this.loadDictionaryById(145).then(res => {
    //   this.examStates = res.details
    // })
    this.getList()
  },
  methods: {
    /**
     * 查询数据列表
     */
    getList() {
      this.listLoading = true
      this.postRequest('gateway/exam/api/paper/paper/rateCount', this.listQuery).then(response => {
        this.dataList = response.data
        this.listLoading = false
      }).catch((reason) => {
        this.$notify({
          title: '获取数据列表失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    sortChange(column) {
      this.listQuery.sort.sortOrder = (column.order && column.order === 'descending') ? 'DESC' : 'ASC'
      this.listQuery.sort.sortName = column.prop
      if (this.listQuery.sort.sortName) {
        this.getList()
      }
    },
    handleSearch() {
      this.listQuery.current = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    }
  }
}
</script>

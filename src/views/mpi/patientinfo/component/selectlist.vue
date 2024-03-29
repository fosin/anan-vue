<template>
  <div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="努力加载中"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column align="center" label="卡号" sortable prop="cardNo" width="150" />
      <el-table-column align="center" label="身份证号" sortable prop="idcard" width="180" />
      <el-table-column align="center" label="姓名" sortable prop="name" />
      <el-table-column align="center" label="姓名简码" sortable prop="pycode" />
      <el-table-column align="center" label="性别" width="100" sortable prop="sex">
        <template slot-scope="scope">
          <span>{{ getAnanDicValue(sexOptions, scope.row.sex) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="出生日期" sortable prop="birthday" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.birthday | dateFormatFilter('yyyy-MM-dd') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="住址" sortable prop="address" />
      <el-table-column align="center" label="邮编" sortable prop="postal" />
      <el-table-column align="center" label="本人电话" sortable prop="phone" />
      <el-table-column align="center" label="籍贯" sortable prop="nativePlace" />
      <el-table-column align="center" label="户口" sortable prop="household" />
      <el-table-column align="center" label="国籍" sortable prop="nationality">
        <template slot-scope="scope">
          <span>{{ getAnanDicValue(nationalityOptions, scope.row.nationality) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="民族" sortable prop="nation">
        <template slot-scope="scope">
          <span>{{ getAnanDicValue(nationOptions, scope.row.nation) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="血型" sortable prop="bloodtype">
        <template slot-scope="scope">
          <span>{{ getAnanDicValue(bloodtypeOptions, scope.row.bloodtype) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="RH血型" sortable prop="rhblood">
        <template slot-scope="scope">
          <span>{{ getAnanDicValue(rhbloodOptions, scope.row.rhblood) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="婚姻" sortable prop="marital">
        <template slot-scope="scope">
          <span>{{ getAnanDicValue(maritalOptions, scope.row.marital) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="参加工作时间" sortable prop="workDate" />
      <el-table-column align="center" label="职业类别" sortable prop="workType">
        <template slot-scope="scope">
          <span>{{ getAnanDicValue(workTypeOptions, scope.row.workType) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="文化程度" sortable prop="education">
        <template slot-scope="scope">
          <span>{{ getAnanDicValue(nationalityOptions, scope.row.nationality) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="参保类型" sortable prop="insurance">
        <template slot-scope="scope">
          <span>{{ getAnanDicValue(insuranceOptions, scope.row.insurance) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="保险类型" sortable prop="insurancetype">
        <template slot-scope="scope">
          <span>{{ getAnanDicValue(insurancetypeOptions, scope.row.insurancetype) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="工作单位" sortable prop="workplace" />
      <!-- <el-table-column align="center" label="档案状态" sortable prop="status">
        <template slot-scope="scope">
          <span>{{getAnanDicValue(statusOptions, scope.row.status)}}</span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="是否死亡" sortable prop="death">
        <template slot-scope="scope">
          <span>{{ getAnanDicValue(deathOptions, scope.row.death) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="信息来源" sortable prop="infoFrom">
        <template slot-scope="scope">
          <span>{{ getAnanDicValue(infoFromOptions, scope.row.infoFrom) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="版本号" sortable prop="version" />
      <el-table-column align="center" label="联系人身份证" sortable prop="contactIdcard" />
      <el-table-column align="center" label="联系人姓名" sortable prop="contactName" />
      <el-table-column align="center" label="联系人电话" sortable prop="contactPhone" />
      <el-table-column align="center" label="联系人信息" sortable prop="contactInfo" />
      <el-table-column align="center" label="更新数据" sortable prop="updatesign" />
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        :current-page.sync="pageModule.pageNumber"
        :page-sizes="pageSizes"
        :page-size="pageModule.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { formatDate } from '@/utils/date'
import { listPatientinfoPageByStatus } from './patientinfo'
export default {
  name: 'MpiPatientinfoList',
  filters: {
    dateFormatFilter(date, pattern) {
      return formatDate(date, pattern || 'yyyy-MM-dd HH:mm:ss')
    }
  },
  props: {
    status: {
      type: Number,
      default: 0
    },
    mpiIdMain: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: false,
      multipleSelection: [],
      pageModule: {
        pageNumber: 1,
        pageSize: 10,
        params: {
          sortRules: [{
            sortName: 'name',
            sortOrder: 'ASC' }
          ]
        }
      },
      pageSizes: [5, 10, 25, 50, 100],
      form: {},
      // statusOptions: [],
      sexOptions: [],
      nationOptions: [],
      nationalityOptions: [],
      bloodtypeOptions: [],
      rhbloodOptions: [],
      maritalOptions: [],
      educationOptions: [],
      insuranceOptions: [],
      insurancetypeOptions: [],
      workTypeOptions: [],
      deathOptions: [],
      infoFromOptions: [],
      mpidIds: []
    }
  },
  mounted() {
    /* this.loadDictionaryById(11).then(res => {
        this.statusOptions = res.details
      })*/
    this.loadDictionaryById(15).then(res => {
      this.sexOptions = res.details
    })
    this.loadDictionaryById(6).then(res => {
      this.nationOptions = res.details
    })
    this.loadDictionaryById(2).then(res => {
      this.nationalityOptions = res.details
    })
    this.loadDictionaryById(21).then(res => {
      this.bloodtypeOptions = res.details
    })
    this.loadDictionaryById(131).then(res => {
      this.rhbloodOptions = res.details
    })
    this.loadDictionaryById(5).then(res => {
      this.maritalOptions = res.details
    })
    this.loadDictionaryById(43).then(res => {
      this.educationOptions = res.details
    })
    this.loadDictionaryById(129).then(res => {
      this.insuranceOptions = res.details
    })
    this.loadDictionaryById(130).then(res => {
      this.insurancetypeOptions = res.details
    })
    this.loadDictionaryById(103).then(res => {
      this.workTypeOptions = res.details
    })
    this.loadDictionaryById(128).then(res => {
      this.deathOptions = res.details
    })
    this.loadDictionaryById(132).then(res => {
      this.infoFromOptions = res.details
    })

    this.loadOrganizParameterValue('DefaultPageSize', '10', '表格默认每页记录数').then(res => {
      this.pageModule.pageSize = parseInt(res)
    })
    this.loadOrganizParameterValue('DefaultPageSizes', '5,10,25,50,100', '表格默认每页记录数可选择项').then(res => {
      const temp = res.split(',')
      this.pageSizes = []
      for (let i = 0; i < temp.length; i++) {
        this.pageSizes[i] = parseInt(temp[i])
      }
    })
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listPatientinfoPageByStatus(this.pageModule, this.status || 0).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      }).catch(reason => {
        this.$notify({
          title: '获取列表失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    handleSearch(searchText) {
      this.pageModule.pageNumber = 1
      this.pageModule.searchText = searchText
      this.getList()
    },
    handleSizeChange(val) {
      this.pageModule.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageModule.pageNumber = val
      this.getList()
    },
    sortChange(column) {
      const sortRule = {
        sortOrder: (column.order && column.order === 'descending') ? 'DESC' : 'ASC',
        sortName: column.prop
      }
      this.pageModule.params.sortRules = []
      this.pageModule.params.sortRules.push(sortRule)
      if (column.prop) {
        this.getList()
      }
    },
    rowClick(row, event, column) {
      this.form = row
      this.$emit('rowClick', this.form)
    },
    handleMerge() {
      if (!this.multipleSelection || this.multipleSelection.length < 1 || this.multipleSelection.length > 3) {
        this.$message({
          message: '合并操作前请至少选择一条/最多不能超过三条数据！！'
        })
        return false
      }
      // this.$emit('handleSelectionChange', this.multipleSelection)
      return true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.$emit('handleSelectionChange', this.multipleSelection)
      if (!this.multipleSelection || this.multipleSelection.length < 1 || this.multipleSelection.length > 3) {
        this.$message({
          message: '合并操作前请至少选择一条/最多不能超过三条数据！'
        })
      }
    }
  }
}
</script>

<style scoped>
  .el-select {
    width: 100%;
  }
  .el-date-picker {
    width: 100%;
  }
</style>

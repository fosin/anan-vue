<template>
  <div>
    <el-table
      v-loading="listLoading"
      :data="list"
      :default-sort="{prop: 'name', order: 'ascending'}"
      element-loading-text="努力加载中"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
      @row-click="rowClick"
    >
      <el-table-column align="center" label="卡号" sortable prop="cardNo" width="150" />
      <el-table-column align="center" label="身份证号" sortable prop="idcard" width="180"></el-table-column>
      <el-table-column align="center" label="姓名" sortable prop="name" />
      <el-table-column align="center" label="姓名简码" sortable prop="pycode" />
      <el-table-column align="center" label="性别" width="100" sortable prop="sex">
        <template slot-scope="scope">
          <span>{{ getDicNameValue(sexOptions, scope.row.sex) }}</span>
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
          <span>{{ getDicNameValue(nationalityOptions, scope.row.nationality) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="民族" sortable prop="nation">
        <template slot-scope="scope">
          <span>{{ getDicNameValue(nationOptions, scope.row.nation) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="血型" sortable prop="bloodtype">
        <template slot-scope="scope">
          <span>{{ getDicNameValue(bloodtypeOptions, scope.row.bloodtype) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="RH血型" sortable prop="rhblood">
        <template slot-scope="scope">
          <span>{{ getDicNameValue(rhbloodOptions, scope.row.rhblood) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="婚姻" sortable prop="marital">
        <template slot-scope="scope">
          <span>{{ getDicNameValue(maritalOptions, scope.row.marital) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="参加工作时间" sortable prop="workDate" width="140px" />
      <el-table-column align="center" label="职业类别" sortable prop="workType">
        <template slot-scope="scope">
          <span>{{ getDicNameValue(workTypeOptions, scope.row.workType) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="文化程度" sortable prop="education">
        <template slot-scope="scope">
          <span>{{ getDicNameValue(nationalityOptions, scope.row.nationality) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="参保类型" sortable prop="insurance">
        <template slot-scope="scope">
          <span>{{ getDicNameValue(insuranceOptions, scope.row.insurance) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="保险类型" sortable prop="insurancetype">
        <template slot-scope="scope">
          <span>{{ getDicNameValue(insurancetypeOptions, scope.row.insurancetype) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="工作单位" sortable prop="workplace" />
      <!-- <el-table-column align="center" label="档案状态" sortable prop="status">
        <template slot-scope="scope">
          <span>{{getDicNameValue(statusOptions, scope.row.status)}}</span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="是否死亡" sortable prop="death">
        <template slot-scope="scope">
          <span>{{ getDicNameValue(deathOptions, scope.row.death) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="信息来源" sortable prop="infoFrom">
        <template slot-scope="scope">
          <span>{{ getDicNameValue(infoFromOptions, scope.row.infoFrom) }}</span>
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
import { listPatientinfoPageByStatus } from './patientinfo'
import { formatDate } from '@/utils/date'
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
      default: undefined
    }
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      pageModule: {
        pageNumber: 1,
        pageSize: 10,
        searchText: '',
        sortName: '',
        sortOrder: ''
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
      infoFromOptions: []
    }
  },
  mounted() {
    /* this.asyncLoadDictionaryByCode(11, (data) => {
        this.statusOptions = data
      })*/
    this.asyncLoadDictionaryByCode(15, (data) => {
      this.sexOptions = data
    })
    this.asyncLoadDictionaryByCode(6, (data) => {
      this.nationOptions = data
    })
    this.asyncLoadDictionaryByCode(2, (data) => {
      this.nationalityOptions = data
    })
    this.asyncLoadDictionaryByCode(21, (data) => {
      this.bloodtypeOptions = data
    })
    this.asyncLoadDictionaryByCode(131, (data) => {
      this.rhbloodOptions = data
    })
    this.asyncLoadDictionaryByCode(5, (data) => {
      this.maritalOptions = data
    })
    this.asyncLoadDictionaryByCode(43, (data) => {
      this.educationOptions = data
    })
    this.asyncLoadDictionaryByCode(129, (data) => {
      this.insuranceOptions = data
    })
    this.asyncLoadDictionaryByCode(130, (data) => {
      this.insurancetypeOptions = data
    })
    this.asyncLoadDictionaryByCode(103, (data) => {
      this.workTypeOptions = data
    })
    this.asyncLoadDictionaryByCode(128, (data) => {
      this.deathOptions = data
    })
    this.asyncLoadDictionaryByCode(132, (data) => {
      this.infoFromOptions = data
    })

    this.asyncOrganizParameterValue('DefaultPageSize', '10', '表格默认每页记录数', (data) => {
      this.pageModule.pageSize = parseInt(data)
    })
    this.asyncOrganizParameterValue('DefaultPageSizes', '5,10,25,50,100', '表格默认每页记录数可选择项', (data) => {
      const temp = data.split(',')
      this.pageSizes = []
      for (let i = 0; i < temp.length; i++) {
        this.pageSizes[i] = parseInt(temp[i])
      }
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      listPatientinfoPageByStatus(this.pageModule, this.status || 0).then(response => {
        this.list = response.data.rows
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
      this.pageModule.sortOrder = (column.order && column.order === 'descending') ? 'DESC' : 'ASC'
      this.pageModule.sortName = column.prop
      if (this.pageModule.sortName) {
        this.getList()
      }
    },
    rowClick(row, event, column) {
      this.form = row
      this.$emit('rowClick', this.form)
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

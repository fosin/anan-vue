<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group>
        <el-button
          v-waves
          round
          class="filter-item"
          style="margin-left: 5px;"
          size="small"
          type="primary"
          icon="el-icon-refresh"
          @click="handleSearch"
        >
          {{ $t('table.refresh') }}
        </el-button>
        <el-button
          v-waves
          v-permission="'182'"
          round
          class="filter-item"
          style="margin-left: 10px;"
          size="small"
          type="primary"
          icon="el-icon-circle-plus"
          @click="handleAdd"
        >{{ $t('table.add') }}
        </el-button>
      </el-button-group>
    </div>
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
    >
      <el-table-column label="所属语言" align="center" sortable prop="internationalId" width="150px">
        <template slot-scope="scope">
          <el-tag>{{ internationalFilter(scope.row.internationalId) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="所属服务" align="center" sortable prop="serviceId" width="200px">
        <template slot-scope="scope">
          <el-tag>{{ serviceIdFilter(scope.row.serviceId) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态码" align="center" class-name="status-col" width="100px" sortable prop="status">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.updateBy.label')"
        align="center"
        sortable
        prop="updateBy"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ getDicValue(organizTopUsers,"id",scope.row.updateBy,"username") }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.updateTime.label')" width="160px" align="center" sortable prop="updateTime" />
      <el-table-column :label="$t('table.actions')" align="center" fixed="right" width="120px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="$t('table.edit')" placement="top">
            <el-button
              v-waves
              v-permission="'183'"
              round
              size="mini"
              type="success"
              class="filter-item"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('table.delete')" placement="top">
            <el-button
              v-waves
              v-permission="'184'"
              round
              size="mini"
              type="danger"
              class="filter-item"
              style="margin-left: 5px;"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination
        :current-page.sync="pageModule.pageNumber"
        :page-sizes="pageSizes"
        :page-size="pageModule.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="90%"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="国际化语言" prop="internationalId">
              <el-select v-model="form.internationalId" placeholder="国际化语言" class="filter-item" value="" disabled>
                <el-option v-for="item in allInternationals" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('anan_permission.serviceId.label')" prop="serviceId">
              <el-select
                v-model="form.serviceId"
                :placeholder="$t('anan_permission.serviceId.placeholder')"
                class="filter-item"
                value=""
              >
                <el-option v-for="item in allServices" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="状态" prop="status">
              <el-switch
                v-model="form.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="禁用"
                :active-value="0"
                :inactive-value="1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <div align="right">
              <el-button
                v-if="dialogStatus==='create'"
                type="primary"
                icon="el-icon-circle-check"
                @click="create('form')"
              >{{ $t('table.confirm') }}
              </el-button>
              <el-button v-else type="primary" icon="el-icon-circle-check" @click="update('form')">
                {{ $t('table.update') }}
              </el-button>
              <el-button icon="el-icon-circle-close" autofocus @click="cancel('form')">
                {{ $t('table.cancel') }}
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-form-item label="字符集：" prop="charsets">
          <json-editor v-model="form.charset" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" />
    </el-dialog>
  </div>
</template>
<script>
import { deleteCharset, getCharset, listCharsetPage, postCharset, putCharset } from './charset'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { formatDate } from '@/utils/date'
import { listService } from '@/views/platform/service/service'
import { listInternational } from '@/views/platform/international/international'
import JsonEditor from '@/components/JsonEditor/index'
import { listUserByTopId } from '@/views/platform/user/user'

export default {
  name: 'AnanInternationalCharset',
  directives: {
    waves
  },
  components: { JsonEditor },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '启用',
        1: '禁用'
      }
      return statusMap[status]
    },
    dateFormatFilter(date, pattern) {
      return formatDate(date, pattern || 'yyyy-MM-dd HH:mm:ss')
    }
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: false,
      pageModule: {
        pageNumber: 1,
        pageSize: 10,
        params: {
          internationalId: 0,
          sortRules: [{
            sortName: 'id',
            sortOrder: 'ASC'
          }]
        }
      },
      pageSizes: [5, 10, 25, 50, 100],
      form: {},
      rules: {},
      statusOptions: [0, 1],
      allServices: [],
      organizTopUsers: [],
      allInternationals: [],
      selectedInternational: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      }
    }
  },
  created() {
    this.loadOrganizParameterValue('DefaultPageSize', '10', '表格默认每页记录数').then(res => {
      this.pageModule.pageSize = parseInt(res)
    })
    this.loadOrganizParameterValue('DefaultPageSizes', '5,10,25,50,100', '表格默认每页记录数可选择项').then(res => {
      const temp = res.split(',')
      for (let i = 0; i < temp.length; i++) {
        this.pageSizes[i] = parseInt(temp[i])
      }
    })
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
    listService().then(response => {
      this.allServices = response.data
    }).catch(reason => {
      this.$notify({
        title: '加载服务列表失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
    listInternational().then(response => {
      this.allInternationals = response.data
    }).catch(reason => {
      this.$notify({
        title: '加载语言列表失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
  },
  methods: {
    internationalFilter(id) {
      const data = this.allInternationals
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          return data[i].name
        }
      }
    },
    internationalIconFilter(id) {
      const data = this.allInternationals
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          return data[i].icon
        }
      }
    },
    serviceIdFilter(id) {
      const data = this.allServices
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          return data[i].name
        }
      }
    },
    getList(row) {
      if (row && row.id) {
        this.selectedInternational = row
      } else {
        if (!this.selectedInternational || !this.selectedInternational.id) {
          return
        }
      }
      this.listLoading = true
      this.pageModule.params.internationalId = this.selectedInternational.id
      listCharsetPage(this.pageModule).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      }).catch(reason => {
        this.$notify({
          title: '获取字典明细项列表失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    handleSearch() {
      this.pageModule.pageNumber = 1
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
    handleAdd() {
      this.resetForm()
      if (!this.form.internationalId) {
        this.$message({
          message: '操作前请先选择一种语言!'
        })
        return
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      getCharset(row['id']).then(response => {
        const data = response.data
        data.charset = JSON.parse(data.charset)
        this.form = data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      }).catch(reason => {
        this.$notify({
          title: '获取失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    handleDelete(row) {
      this.$confirm(
        '此操作将永久删除相关数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteCharset(row['id']).then(response => {
          this.dialogFormVisible = false
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功!',
            type: 'success',
            duration: 2000
          })
        }).catch(reason => {
          this.$notify({
            title: '删除失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      }).catch(reason => {
      })
    },
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          postCharset(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }).catch(reason => {
            this.$notify({
              title: '新建失败',
              message: reason.message,
              type: 'error',
              duration: 5000
            })
          })
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      this.dialogFormVisible = false
      if (formName === 'form') {
        this.$refs['form'].resetFields()
      }
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          putCharset(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          }).catch(reason => {
            this.$notify({
              title: '更新信息失败',
              message: reason.message,
              type: 'error',
              duration: 5000
            })
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.form = {
        status: 0,
        charset: {},
        internationalId: this.selectedInternational.id
      }
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
    }
  }
}
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>

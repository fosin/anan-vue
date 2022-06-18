<template>
  <div class="app-container calendar-list-container">
    <data-table
      ref="pagingTable"
      :options="options"
      :list-query="listQuery"
      style="width: 100%"
      @handle-add="handleAdd()"
    >
      <template slot="filter-content" />
      <template slot="data-columns">
        <el-table-column label="唯一标识" align="center" sortable prop="id" />
        <el-table-column label="服务标识" align="center" sortable prop="code" />
        <el-table-column label="服务名称" align="center" sortable prop="name" />
        <el-table-column label="状态码" align="center" class-name="status-col" sortable prop="status" width="100px">
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
        <el-table-column :label="$t('table.actions')" align="center" width="100px">
          <template slot-scope="scope">
            <el-button
              v-waves
              v-permission="'172'"
              round
              size="mini"
              type="success"
              class="filter-item"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >
              {{ $t('table.edit') }}
            </el-button>
          </template>
        </el-table-column>
      </template>
    </data-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="服务标识" prop="code">
          <el-select v-model="form.code" filterable allow-create placeholder="选择服务标识" class="filter-item">
            <el-option v-for="item in onlineServices" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="服务名称" prop="name">
          <el-input v-model="form.name" placeholder="服务名称" />
        </el-form-item>
        <el-form-item label="状态码" prop="status">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-circle-close" @click="cancel('form')">{{ $t('table.cancel') }}</el-button>
        <el-button
          v-if="dialogStatus==='create'"
          type="primary"
          icon="el-icon-circle-check"
          autofocus
          @click="create('form')"
        >{{ $t('table.confirm') }}
        </el-button>
        <el-button v-else type="primary" icon="el-icon-circle-check" autofocus @click="update('form')">
          {{ $t('table.update') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { loadServiceNames } from '@/api/application'
import DataTable from '@/components/DataTable'
import waves from '@/directive/waves/index.js'
import { formatDate } from '@/utils/date'
import { listUserByTopId } from '@/views/platform/user/user'
import { getService, postService, putService } from './service'
export default {
  name: 'AnanService',
  components: {
    DataTable
  },
  directives: {
    waves
  },
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
      listQuery: {
        listUrl: 'gateway/platform/v1/service/paging',
        pageSizes: [5, 10, 25, 50, 100],
        search: {
          input: null,
          cols: ['name', 'code'],
          placeholder: '支持服务标识、服务名称查找'
        },
        pageModule: {
          pageNumber: 1,
          pageSize: 10,
          params: {
            name: null,
            code: null,
            queryRule: {
              logiOperator: 'or',
              relaRules: [
                {
                  fieldName: 'name',
                  relaOperator: 'like'
                },
                {
                  fieldName: 'code',
                  relaOperator: 'like'
                }
              ]
            },
            sortRules: [{
              sortName: 'id',
              sortOrder: 'ASC' }
            ]
          }
        }
      },
      options: {
        // 可批量操作
        multi: true,
        // 批量操作列表
        multiActions: [
          {
            value: 'delete',
            label: this.$t('table.delete'),
            url: 'gateway/platform/v1/service/ids',
            method: 'delete',
            permissionId: '173',
            confirm: true
          }
        ],
        addAction: {
          enable: true,
          route: '',
          permissionId: '171'
        },
        tableRowClass: {
          column: 'status',
          data: [
            {
              key: 1,
              value: 'info-row'
            }
          ]
        }
      },
      pageSizes: [5, 10, 25, 50, 100],
      form: {},
      rules: {},
      statusOptions: [0, 1],
      onlineServices: [],
      organizTopUsers: [],
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
      this.listQuery.pageModule.pageSize = parseInt(res)
    })
    this.loadOrganizParameterValue('DefaultPageSizes', '5,10,25,50,100', '表格默认每页记录数可选择项').then(res => {
      const temp = res.split(',')
      for (let i = 0; i < temp.length; i++) {
        this.pageSizes[i] = parseInt(temp[i])
      }
    })
    loadServiceNames().then(response => {
      this.onlineServices = response.data.data
    }).catch(reason => {
      this.$notify({
        title: '获取在线服务列表失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
    listUserByTopId().then(response => {
      this.organizTopUsers = response.data.data
    }).catch(reason => {
      this.$notify({
        title: '获取所有用户失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
  },
  methods: {
    handleAdd() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      getService(row.id).then(response => {
        this.form = response.data.data
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
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          postService(this.form).then(() => {
            this.dialogFormVisible = false
            this.$refs.pagingTable.getList()
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
          putService(this.form).then(() => {
            this.dialogFormVisible = false
            this.$refs.pagingTable.getList()
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
        status: 0
      }
    }
  }
}
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>

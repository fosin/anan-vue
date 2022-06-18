<template>
  <div class="app-container calendar-list-container">
    <data-table
      ref="pagingTable"
      :options="options"
      :list-query="listQuery"
      style="width: 100%"
      @handle-add="handleAdd()"
      @handle-row-click="handleRowClick"
    >
      <template slot="filter-content" />
      <template slot="data-columns">
        <el-table-column label="图标/标识" align="center" prop="icon" width="150px">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon" style="width: 40px; height: 30px; background: #fff; color: #40c9c6;" />
            {{ scope.row.code }}
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" sortable prop="name" width="150px">
          <template slot-scope="scope">
            {{ scope.row.name }}<el-tag v-if="scope.row.defaultFlag===1">{{ scope.row.defaultFlag | defaultFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" class-name="status-col" sortable prop="status" width="100px">
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
        <el-table-column :label="$t('table.actions')" align="center" fixed="right" width="80px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="$t('table.edit')" placement="top">
              <el-button
                v-waves
                v-permission="'178'"
                round
                size="mini"
                type="success"
                class="filter-item"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </data-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标识：" prop="code">
          <el-input v-model="form.code" placeholder="国际化语言通用标识" />
        </el-form-item>
        <el-form-item label="名称：" prop="name">
          <el-input v-model="form.name" placeholder="国际化语言名称" />
        </el-form-item>
        <el-form-item label="图标：" prop="icon">
          <el-row>
            <el-col :span="20">
              <el-input v-model="form.icon" placeholder="国际化语言图标" />
            </el-col>
            <el-col :span="4">
              <svg-icon :icon-class="form.icon" style="width: 40px; height: 30px; background: #fff; color: #40c9c6;" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="状态：" prop="status">
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
        <el-form-item label="默认标志：" prop="defaultFlag">
          <el-switch
            v-model="form.defaultFlag"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="默认"
            inactive-text="非默认"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
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
        <el-button icon="el-icon-circle-close" autofocus @click="cancel('form')">{{ $t('table.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import DataTable from '@/components/DataTable'

import waves from '@/directive/waves/index.js'
import { formatDate } from '@/utils/date'
import { listUserByTopId } from '@/views/platform/user/user'
import { getInternational, postInternational, putInternational } from './international'

export default {
  name: 'AnanInternational',
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
    defaultFilter(status) {
      const statusMap = {
        0: '',
        1: '默认'
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
        listUrl: 'gateway/platform/v1/international/paging',
        pageSizes: [5, 10, 25, 50, 100],
        search: {
          colSpan: 12,
          input: null,
          cols: ['name', 'code'],
          placeholder: '支持语言标识、语言名称查找'
        },
        pageModule: {
          pageNumber: 1,
          pageSize: 10,
          params: {
            code: null,
            name: null,
            queryRule: {
              logiOperator: 'or',
              relaRules: [
                {
                  relaOperator: 'like',
                  fieldName: 'code'
                },
                {
                  relaOperator: 'like',
                  fieldName: 'name'
                }
              ]
            }
          },
          sortRules: [{
            sortName: 'defaultFlag',
            sortOrder: 'DESC'
          }]
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
            url: 'gateway/platform/v1/international/ids',
            method: 'delete',
            permissionId: '179',
            confirm: true
          },
          {
            value: 'disable',
            label: this.$t('table.disable'),
            url: 'gateway/platform/v1/international/field/status/1',
            method: 'post',
            permissionId: '178',
            confirm: false
          },
          {
            value: 'enable',
            label: this.$t('table.enable'),
            url: 'gateway/platform/v1/international/field/status/0',
            method: 'post',
            permissionId: '178',
            confirm: false
          }
        ],
        addAction: {
          enable: true,
          route: '',
          permissionId: '177'
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
      getInternational(row['id']).then(response => {
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
          postInternational(this.form).then(() => {
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
          putInternational(this.form).then(() => {
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
        status: 0,
        defaultFlag: 0
      }
    },
    handleRowClick(row, event, column) {
      if (!this.form || this.form.id !== row.id) {
        this.form = row
        this.$emit('dic-row-click', row, event, column)
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

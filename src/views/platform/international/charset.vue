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
        <el-table-column :label="$t('table.actions')" align="center" fixed="right" width="80px">
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
          </template>
        </el-table-column>
      </template>
    </data-table>

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
import DataTable from '@/components/DataTable'
import JsonEditor from '@/components/JsonEditor/index'
import waves from '@/directive/waves/index.js'
import { formatDate } from '@/utils/date'
import { listInternational } from '@/views/platform/international/international'
import { listService } from '@/views/platform/service/service'
import { listUserByTopId } from '@/views/platform/user/user'
import { getCharset, postCharset, putCharset } from './charset'

export default {
  name: 'AnanInternationalCharset',
  components: {
    JsonEditor,
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
        listUrl: 'gateway/platform/v1/international/charset/paging',
        pageSizes: [5, 10, 25, 50, 100],
        search: {
          colSpan: 12,
          input: null,
          cols: ['charset'],
          placeholder: this.$t('anan_dictionary_detail.searchText')
        },
        pageModule: {
          pageNumber: 1,
          pageSize: 10,
          params: {
            internationalId: 0,
            charset: null,
            queryRule: {
              logiOperator: 'and',
              relaRules: [
                {
                  fieldName: 'charset',
                  relaOperator: 'like'
                }
              ]
            },
            sortRules: [{
              sortName: 'id',
              sortOrder: 'ASC'
            }]
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
            url: 'gateway/platform/v1/international/charset/ids',
            method: 'delete',
            permissionId: '184',
            confirm: true
          },
          {
            value: 'disable',
            label: this.$t('table.disable'),
            url: 'gateway/platform/v1/international/charset/field/status/1',
            method: 'post',
            permissionId: '183',
            confirm: false
          },
          {
            value: 'enable',
            label: this.$t('table.enable'),
            url: 'gateway/platform/v1/international/charset/field/status/0',
            method: 'post',
            permissionId: '183',
            confirm: false
          }
        ],
        addAction: {
          enable: true,
          route: '',
          permissionId: '182'
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
    listService().then(response => {
      this.allServices = response.data.data
    }).catch(reason => {
      this.$notify({
        title: '加载服务列表失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
    listInternational().then(response => {
      this.allInternationals = response.data.data
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
    getList(row) {
      if (row && row.id) {
        this.listQuery.pageModule.params.internationalId = row.id
        this.$refs.pagingTable.getList()
      }
    },
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
        const data = response.data.data
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
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          postCharset(this.form).then(() => {
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
          putCharset(this.form).then(() => {
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
        charset: {},
        internationalId: this.selectedInternational.id
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

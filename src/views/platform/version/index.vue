<template>
  <div class="app-container calendar-list-container">
    <!-- <div class="filter-container">
      <el-input
        v-model="pageModule.params.name"
        :placeholder="$t('anan_version.searchText')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleSearch()"
      />
      <el-button-group>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" round @click="handleSearch()">
          {{ $t('table.search') }}
        </el-button>
        <el-button
          v-permission="'112'"
          v-waves
          class="filter-item"
          style="margin-left: 5px;"
          type="primary"
          icon="el-icon-circle-plus"
          round
          @click="handleAdd()"
        >
          {{ $t('table.add') }}
        </el-button>
      </el-button-group>
    </div> -->
    <data-table
      ref="pagingTable"
      :options="options"
      :list-query="listQuery"
      style="width: 100%"
      @handle-add="handleAdd()"
    >
      <template slot="filter-content" />
      <template slot="data-columns">
        <el-table-column :label="$t('anan_version.name.label')" align="center" sortable prop="name" width="180px" />
        <el-table-column :label="$t('anan_version.type.label')" align="center" sortable prop="type" width="120px">
          <template slot-scope="scope">
            <el-tag>{{ getAnanDicValue(typeOptions,scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('anan_version.price.label')" align="center" sortable prop="price" width="120px" />
        <el-table-column :label="$t('anan_version.validity.label')" align="center" sortable prop="validity" width="100px" />
        <el-table-column :label="$t('anan_version.tryoutDays.label')" align="center" sortable prop="tryoutDays" width="110px" />
        <el-table-column :label="$t('anan_version.protectDays.label')" align="center" sortable prop="protectDays" width="100px" />
        <el-table-column :label="$t('anan_version.maxOrganizs.label')" align="center" sortable prop="maxOrganizs" width="140px" />
        <el-table-column :label="$t('anan_version.maxUsers.label')" align="center" sortable prop="maxUsers" width="120px" />
        <!--<el-table-column align="center" :label="$t('anan_version.beginTime.label')" sortable prop="beginTime" width="160"></el-table-column>
      <el-table-column align="center" :label="$t('anan_version.endTime.label')" sortable prop="endTime" width="160"></el-table-column>-->
        <el-table-column :label="$t('anan_version.status.label')" align="center" sortable prop="status" width="110px">
          <template slot-scope="scope">
            <el-tag>{{ getAnanDicValue(statusOptions,scope.row.status) }}</el-tag>
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
        <el-table-column :label="$t('table.actions')" align="center" width="120px" fixed="right">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="$t('table.edit')" placement="top">
              <el-button
                v-waves
                v-permission="'113'"
                round
                size="mini"
                type="success"
                class="filter-item"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
              />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('table.permission')" placement="top">
              <el-button
                round
                size="mini"
                type="warning"
                icon="el-icon-menu"
                style="margin-left: 5px;"
                @click="handlePermission(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </data-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('anan_version.name.label')" prop="name">
              <el-input v-model="form.name" :placeholder="$t('anan_version.name.placeholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('anan_version.type.label')" prop="type">
              <el-select v-model="form.type" :placeholder="$t('anan_version.type.placeholder')" class="filter-item">
                <el-option v-for="item in typeOptions" :key="item.name" :label="item.value" :value="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('anan_version.price.label')" prop="price">
              <el-input v-model.number="form.price" :placeholder="$t('anan_version.price.placeholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('anan_version.validity.label')" prop="validity">
              <el-input v-model.number="form.validity" :placeholder="$t('anan_version.validity.placeholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('anan_version.protectDays.label')" prop="protectDays">
              <el-input v-model.number="form.protectDays" :placeholder="$t('anan_version.protectDays.placeholder')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('anan_version.beginTime.label')" prop="beginTime" label-width="120px">
              <el-date-picker
                v-model="form.beginTime"
                :placeholder="$t('anan_version.beginTime.placeholder')"
                align="right"
                type="date"
                style="width: 100%;"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('anan_version.endTime.label')" prop="endTime" label-width="120px">
              <el-date-picker
                v-model="form.endTime"
                :placeholder="$t('anan_version.endTime.placeholder')"
                align="right"
                type="date"
                style="width: 100%;"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('anan_version.status.label')" prop="status">
              <el-switch
                v-model="form.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="0"
                inactive-value="1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="tryout">
              <el-checkbox v-model="tryout">
                {{ $t('anan_version.tryout.label') }}
              </el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="tryout" :label="$t('anan_version.tryoutDays.label')" prop="tryoutDays">
              <el-input v-model.number="form.tryoutDays" :placeholder="$t('anan_version.tryoutDays.placeholder')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('anan_version.description.label')" prop="description">
          <el-input v-model="form.description" :placeholder="$t('anan_version.description.placeholder')" :autosize="{ minRows: 4, maxRows: 20}" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="dialogStatus==='create'"
          type="primary"
          icon="el-icon-circle-check"
          @click="create('form')"
        >
          {{ $t('table.confirm') }}
        </el-button>
        <el-button v-else type="primary" icon="el-icon-circle-check" @click="update('form')">
          {{ $t('table.update') }}
        </el-button>
        <el-button icon="el-icon-circle-close" autofocus @click="cancel('form')">
          {{ $t('table.cancel') }}
        </el-button>
      </div>
    </el-dialog>
    <grantPermission ref="grantPermission" />
  </div>
</template>
<script>
import DataTable from '@/components/DataTable'
import { formatDate } from '@/utils/date'

import { listUserByTopId } from '@/views/platform/user/user'
import grantPermission from '../permission/grantPermission'
import { listChildPermissions } from '../permission/permission'
import { getVersion, listVersionPermissions, postVersion, putVersion, putVersionPermissions } from './version'

export default {
  name: 'DevelopmentVersion',
  components: {
    grantPermission,
    DataTable
  },
  filters: {
    dateFormatFilter(date, pattern) {
      return formatDate(date, pattern || 'yyyy-MM-dd HH:mm:ss')
    }
  },
  data() {
    return {
      listQuery: {
        listUrl: 'gateway/platform/api/version/paging',
        pageSizes: [5, 10, 25, 50, 100],
        search: {
          input: null,
          cols: ['name'],
          placeholder: this.$t('anan_version.searchText')
        },
        pageModule: {
          pageNumber: 1,
          pageSize: 10,
          params: {
            name: null,
            queryRule: {
              logiOperator: 'or',
              relaRules: [
                {
                  fieldName: 'name',
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
            url: 'gateway/platform/api/version/ids',
            method: 'delete',
            permissionId: '114',
            confirm: true
          }
        ],
        addAction: {
          enable: true,
          route: '',
          permissionId: '112'
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
      tryout: false,
      pageSizes: [],
      typeOptions: [],
      statusOptions: [],
      organizTopUsers: [],
      versionPermissions: [],
      form: {},
      rules: {
        name: [
          {
            required: true,
            message: '版本名称不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 64,
            message: '长度在 1 到 30 个字符',
            trigger: 'blur'
          }
        ],
        maxOrganizs: [
          {
            required: true,
            message: '可创建机构数不能为空'
          },
          {
            min: 1,
            type: 'number',
            message: '不能小于1'
          }
        ],
        maxUsers: [
          {
            required: true,
            message: '可创建用户数不能为空'
          },
          {
            min: 1,
            type: 'number',
            message: '不能小于1'
          }
        ],
        protectDays: [
          {
            required: true,
            message: '保护期不能为空'
          },
          {
            min: 0,
            type: 'number',
            message: '不能小于0'
          }
        ],
        tryoutDays: [
          {
            required: true,
            message: '试用期不能为空'
          },
          {
            type: 'number',
            min: 0,
            message: '不能小于0'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择版本类型',
            trigger: 'change'
          }
        ],
        price: [
          {
            type: 'number',
            required: true,
            message: '请输入价格，不能为负数'
          }
        ],
        validity: [
          {
            required: true,
            message: '请输入有效期'
          },
          {
            min: 1,
            type: 'number',
            message: '不能小于1'
          }
        ],
        beginTime: [
          {
            required: true,
            message: '请选择开始日期',
            trigger: 'change'
          }
        ],
        endTime: [
          {
            required: true,
            message: '请选择结束日期',
            trigger: 'change'
          }
        ]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      }
    }
  },
  mounted() {
    this.loadDictionaryById(147).then(res => {
      this.typeOptions = res.details
    }).catch((error) => {
      this.$notify({
        title: '加载字典数据失败',
        message: error.message,
        type: 'error',
        duration: 5000
      })
    })
    this.loadDictionaryById(11).then(res => {
      this.statusOptions = res.details
    })
    this.loadOrganizParameterValue('DefaultPageSize', '10', '表格默认每页记录数').then(res => {
      this.listQuery.pageModule.pageSize = parseInt(res)
    })
    this.loadOrganizParameterValue('DefaultPageSizes', '5,10,25,50,100', '表格默认每页记录数可选择项').then(res => {
      const temp = res.split(',')
      this.pageSizes = []
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
      getVersion(row['id']).then(response => {
        this.form = response.data.data
        this.form.status = this.form.status + ''
        this.tryout = this.form.tryout === 1
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
          this.form.tryout = this.tryout ? 1 : 0
          postVersion(this.form).then(() => {
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
    handlePermission(row) {
      listVersionPermissions(row.id)
        .then(response => {
          this.form = row
          this.versionPermissions = response.data.data
          this.$refs.grantPermission.initData(this, this.form, response.data.data, '125')
        }).catch(reason => {
          this.$notify({
            title: '获取版本权限失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
    },
    updatePermession(id, unionPermissions) {
      // 组装成后台需要的数据格式
      const newRolePermissions = []
      for (let i = 0; i < unionPermissions.length; i++) {
        const permissionId = unionPermissions[i]
        const permissions = this.versionPermissions.filter(function(v) {
          return permissionId === v.permissionId
        })
        const permission = permissions && permissions.length === 1 ? permissions[0] : {
          id: undefined,
          versionId: id,
          permissionId: permissionId
        }
        newRolePermissions.push(permission)
      }
      return new Promise((resolve, reject) => {
        putVersionPermissions(id, newRolePermissions).then(() => {
          resolve(true)
        }).catch(reason => {
          reject(reason)
        })
      })
    },
    listChildPermissions(pid) {
      return new Promise((resolve, reject) => {
        listChildPermissions(pid).then((response) => {
          resolve(response)
        }).catch(reason => {
          reject(reason)
        })
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
          this.form.tryout = this.tryout ? 1 : 0
          putVersion(this.form).then(() => {
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
        id: undefined,
        type: 0,
        name: undefined,
        price: 0.00,
        validity: 365,
        tryoutDays: 0,
        tryout: 0,
        protectDays: 0,
        maxOrganizs: 100,
        maxUsers: 300,
        status: '0'
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

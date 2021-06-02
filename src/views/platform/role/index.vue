<template>
  <div class="app-container calendar-list-container">
    <data-table
      ref="pagingTable"
      :options="options"
      :list-query="listQuery"
      style="width: 100%"
      @handle-add="handleAdd"
    >
      <template slot="filter-content" />
      <template slot="data-columns">
        <el-table-column :label="$t('anan_role.value.label')" align="center" prop="value" sortable />

        <el-table-column :label="$t('anan_role.name.label')" align="center" sortable prop="name" />
        <el-table-column
          :label="$t('anan_role.organizId.label')"
          :formatter="getOrganizName"
          prop="organizId"
          show-overflow-tooltip
          sortable
          align="center"
        />
        <!--      <el-table-column  :label="$t('anan_role.tips.label')" align="center" sortable prop="tips">
              </el-table-column>-->

        <el-table-column :label="$t('anan_role.createTime.label')" align="center" sortable prop="createTime">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateFormatFilter('yyyy-MM-dd HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('anan_role.updateTime.label')" align="center" sortable prop="updateTime">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime | dateFormatFilter('yyyy-MM-dd HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('anan_role.status.label')" align="center" class-name="status-col" width="80" sortable prop="status">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.status | statusFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.actions')" align="center" width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="$t('table.edit')" placement="top">
              <el-button
                v-waves
                v-permission="'25'"
                round
                size="mini"
                type="success"
                class="filter-item"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
              />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('table.user')" placement="top">
              <el-button round size="mini" type="primary" icon="el-icon-user-solid" @click="handleRoleUser(scope.row)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('table.permission')" placement="top">
              <el-button round size="mini" type="warning" icon="el-icon-menu" @click="handleRolePermission(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </data-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item :label="$t('anan_role.value.label')" prop="value">
          <el-input v-model="form.value" :placeholder="$t('anan_role.value.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_role.name.label')" prop="name">
          <el-input v-model="form.name" :placeholder="$t('anan_role.name.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_role.organizId.label')" prop="organizId">
          <el-select
            v-model="form.organizId"
            :placeholder="$t('anan_role.organizId.placeholder')"
            :filter-method="organizSelectFilter"
            class="filter-item"
            filterable
          >
            <el-option
              v-for="item in oraganizOptions"
              :key="item.id"
              :label="item.fullname || item.name"
              :value="item.id"
              :disabled="isDisabled[item.status]"
            >
              <span style="float: left; color: #8492a6; font-size: 13px">{{ item.code }}</span>
              <span style="float: right">{{ item.fullname || item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('anan_role.tips.label')" prop="tips">
          <el-input v-model="form.tips" :placeholder="$t('anan_role.tips.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_role.status.label')" prop="status">
          <el-select v-model="form.status" :placeholder="$t('anan_role.status.placeholder')" class="filter-item">
            <el-option v-for="item in statusOptions" :key="item" :label="item | statusFilter" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="dialogStatus==='create'"
          round
          type="primary"
          icon="el-icon-circle-check"
          @click="create('form')"
        >
          {{ $t('table.confirm') }}
        </el-button>
        <el-button v-else round type="primary" icon="el-icon-circle-check" @click="update('form')">
          {{ $t('table.update') }}
        </el-button>
        <el-button round icon="el-icon-circle-close" autofocus @click="cancel('form')">
          {{ $t('table.cancel') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="textMap[dialogStatus] + ' ---> ' + form.name"
      :visible.sync="dialogRoleUserVisible"
      width="650px"
    >
      <el-transfer
        ref="roleUser"
        v-model="roleUsers"
        :filter-method="roleUserfilterMethod"
        :props="{
          key: 'id',
          label: 'username'
        }"
        :titles="['未拥有用户', '已拥有用户']"
        :data="allUsers"
        filterable
      />
      <div slot="footer" class="dialog-footer">
        <el-button v-waves v-permission="'49'" round type="primary" icon="el-icon-circle-check" @click="updateRoleUser()">
          {{ $t('table.update') }}
        </el-button>
        <el-button v-waves round icon="el-icon-circle-close" @click="cancel('roleUser')">
          {{ $t('table.cancel') }}
        </el-button>
      </div>
    </el-dialog>
    <grantPermission ref="grantPermission" />
  </div>
</template>

<script>
import {
  getRole,
  postRole,
  putRole,
  putRolePermissions,
  listRolePermissions,
  listRoleUsers,
  putRoleUsers
} from './role'
import { listOrganizUser } from '../user/user'
import { formatDate } from '@/utils/date'
import { listOrganizAllChild } from '../organization/organization'
import { mapGetters } from 'vuex'
import grantPermission from '../permission/grantPermission'
import { listVersionChildPermissions } from '../version/version'
import { getOrganiz, getOrganizAuth } from '../organization/organization'
import DataTable from '@/components/DataTable'
export default {
  name: 'SystemRole',
  components: {
    grantPermission,
    DataTable
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '有效',
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
      oraganizOptions: [],
      organizList: [],
      roleUsers: [],
      allUsers: [],
      versionId: -1,
      topId: -1,
      checkedKeys: [],
      expandKeys: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf',
        disabled: 'disabled'
      },
      listQuery: {
        listUrl: 'gateway/platform/v1/role/paging',
        pageSizes: [5, 10, 25, 50, 100],
        search: {
          cols: ['name', 'value'],
          placeholder: this.$t('anan_role.searchText')
        },
        pageModule: {
          pageNumber: 1,
          pageSize: 10,
          params: {
            organizId: 0,
            name: '',
            value: '',
            queryRule: {
              relaRules: [
                {
                  filedName: 'name',
                  relaOperator: 'like'
                },
                {
                  filedName: 'value',
                  relaOperator: 'like'
                }
              ],
              logiOperator: 'or'
            },
            sortRules: [{
              sortName: 'value',
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
            url: 'gateway/platform/v1/role/ids',
            method: 'delete',
            permissionId: '26',
            confirm: true
          },
          {
            value: 'enableStatus',
            label: this.$t('table.enable'),
            url: 'gateway/platform/v1/role/status/0',
            method: 'post',
            permissionId: '25',
            confirm: false
          },
          {
            value: 'disableStatus',
            label: this.$t('table.disable'),
            url: 'gateway/platform/v1/role/status/1',
            method: 'post',
            permissionId: '25',
            confirm: false
          }
        ],
        addAction: {
          enable: true,
          route: '',
          permissionId: '24'
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
      form: {},
      rules: {
        name: [
          {
            required: true,
            message: '角色名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 64,
            message: '长度在 1 到 64 个字符',
            trigger: 'blur'
          }
        ],
        organizId: [
          {
            required: true,
            message: '请选择机构',
            trigger: 'blur'
          }
        ],
        value: [
          {
            required: true,
            message: '角色标识',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 64,
            message: '长度在 1 到 64 个字符',
            trigger: 'blur'
          }
        ]
      },
      statusOptions: [0, 1],
      rolesOptions: undefined,
      dialogFormVisible: false,
      dialogPermissionVisible: false,
      dialogRoleUserVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        permission: '分配权限',
        user: '分配用户'
      },
      isDisabled: {
        0: false,
        1: true
      }
    }
  },
  computed: {
    ...mapGetters(['ananPermissions', 'ananUserInfo'])
  },
  created() {
    if (!this.organizList || this.organizList.length < 1) {
      this.loadOrganizAllChild(this.ananUserInfo.organizId)
    }
    debugger
    this.listQuery.pageModule.params.organizId = this.ananUserInfo.organizId
  },
  methods: {
    roleUserfilterMethod(query, item) {
      return item.usercode.indexOf(query) > -1 || item.username.indexOf(query) > -1
    },
    loadOrganizAllChild(pid) {
      listOrganizAllChild(pid).then(response => {
        this.organizList = response.data || []
        this.oraganizOptions = this.organizList
      }).catch(reason => {
        this.$notify({
          title: '查询后代机构信息失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    organizSelectFilter(input) {
      this.oraganizOptions = this.organizList.filter((value) => {
        return value.name.indexOf(input) !== -1 || value.id.indexOf(input) !== -1 || value.fullname.indexOf(input) !== -1
      })
    },
    getOrganizName: function(row) {
      const organiz = this.organizList.filter((value) => {
        return value.id === row.organizId
      })
      if (!organiz || organiz.length < 1) {
        return row.organizId
      }
      return organiz[0].fullname || organiz[0].name || row.organizId
    },
    handleAdd() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      getRole(row.id).then(response => {
        const form = response.data
        if (form && form.builtIn === 1) {
          this.$message({
            message: '系统内置角色不能修改!'
          })
          return
        }
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      }).catch(reason => {
        this.$notify({
          title: '获取角色失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    handleRolePermission(row) {
      listRolePermissions(row.id).then(response1 => {
        getOrganiz(row.organizId).then((response2) => {
          this.topId = response2.data.topId
          this.form = row
          getOrganizAuth(this.topId).then((response3) => {
            const versionId = response3.data.versionId
            this.$refs.grantPermission.initData(this, this.form, response1.data, '43', versionId !== this.versionId)
            this.versionId = versionId
          }).catch(reason => {
            this.$notify({
              title: '获取版本信息失败',
              message: reason.message,
              type: 'error',
              duration: 5000
            })
          })
        }).catch(reason => {
          this.$notify({
            title: '获取机构信息失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      }).catch(reason => {
        this.$notify({
          title: '获取角色权限失败',
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
        const permission = {
          id: undefined,
          roleId: id,
          permissionId: unionPermissions[i]
        }
        newRolePermissions.push(permission)
      }
      return new Promise((resolve, reject) => {
        putRolePermissions(id, newRolePermissions).then(() => {
          resolve(true)
        }).catch(reason => {
          reject(reason)
        })
      })
    },
    listChildPermissions(pid) {
      return new Promise((resolve, reject) => {
        listVersionChildPermissions(pid, this.versionId).then((response) => {
          resolve(response)
        }).catch(reason => {
          reject(reason)
        })
      })
    },
    listOrganizUser() {
      listOrganizUser(this.form.organizId).then(response => {
        this.allUsers = response.data
      }).catch(reason => {
        this.$notify({
          title: '获取所有用户失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    handleRoleUser(row) {
      listRoleUsers(row.id).then(response => {
        this.dialogStatus = 'user'
        this.dialogRoleUserVisible = true
        this.form = row
        this.listOrganizUser()
        const roleUsers = response.data
        this.roleUsers = []
        for (let i = 0; i < roleUsers.length; i++) {
          const user = roleUsers[i].id
          this.roleUsers.push(user)
        }
      }).catch(reason => {
        this.$notify({
          title: '获取角色用户失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    updateRoleUser() {
      const userRoles = []
      for (let i = 0; i < this.roleUsers.length; i++) {
        const roleUser = {
          userId: this.roleUsers[i],
          roleId: this.form.id,
          organizId: undefined
        }
        userRoles.push(roleUser)
      }
      putRoleUsers(this.form.id, userRoles).then(() => {
        this.dialogRoleUserVisible = false
        this.$notify({
          title: '成功',
          message: '修改角色用户成功!',
          type: 'success',
          duration: 2000
        })
      }).catch(reason => {
        this.$notify({
          title: '更新角色用户失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          postRole(this.form).then(() => {
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
              title: '新建角色失败',
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
      this.dialogPermissionVisible = false
      this.dialogRoleUserVisible = false
      if (formName === 'form') {
        this.$refs[formName].resetFields()
      }
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          putRole(this.form).then(() => {
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
              title: '更新角色信息失败',
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
        organizId: undefined,
        name: undefined,
        value: undefined,
        tips: undefined,
        status: 0,
        builtIn: 0
      }
    }
  }
}
</script>


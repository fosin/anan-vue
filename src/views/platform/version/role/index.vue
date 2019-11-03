<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input
        v-model="pageModule.searchText"
        :placeholder="$t('cdp_version_role.searchText')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button-group>
        <el-button v-waves round class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t('table.search') }}
        </el-button>
        <el-button
          v-waves
          v-permission="'121'"
          round
          class="filter-item"
          style="margin-left: 5px;"
          type="primary"
          icon="el-icon-circle-plus"
          @click="handleAdd"
        >
          {{ $t('table.add') }}
        </el-button>
        <el-button
          v-waves
          v-permission="'122'"
          round
          type="success"
          class="filter-item"
          style="margin-left: 5px;"
          icon="el-icon-edit"
          @click="handleEdit()"
        >
          {{ $t('table.edit') }}
        </el-button>
        <el-button
          v-waves
          v-permission="'123'"
          round
          type="danger"
          class="filter-item"
          style="margin-left: 5px;"
          icon="el-icon-delete"
          @click="handleDelete()"
        >
          {{ $t('table.delete') }}
        </el-button>
      </el-button-group>
    </div>

    <el-table
      v-loading="listLoading"
      :data="roleList"
      :default-sort="{prop: 'value', order: 'descending'}"
      element-loading-text="努力加载中"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
      @row-click="rowClick"
    >
      <el-table-column :label="$t('cdp_version_role.value.label')" align="center" sortable prop="value" />

      <el-table-column :label="$t('cdp_version_role.name.label')" align="center" sortable prop="name" />
      <el-table-column
        :label="$t('cdp_version_role.versionId.label')"
        :formatter="getVersionName"
        prop="versionId"
        align="center"
        show-overflow-tooltip
        sortable
      />

      <el-table-column :label="$t('cdp_version_role.createTime.label')" align="center" sortable prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | dateFormatFilter('yyyy-MM-dd HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('cdp_version_role.updateTime.label')" align="center" sortable prop="updateTime" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | dateFormatFilter('yyyy-MM-dd HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('cdp_version_role.status.label')" align="center" class-name="status-col" width="80" sortable prop="status">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.permission')" align="center" width="100">
        <template slot-scope="scope">
          <el-button round size="mini" type="warning" @click="handleVersionRolePermission(scope.row)">
            {{ $t('table.permission') }}
          </el-button>
        </template>
      </el-table-column>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item :label="$t('cdp_version_role.value.label')" prop="value">
          <el-input v-model="form.value" :placeholder="$t('cdp_version_role.value.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('cdp_version_role.name.label')" prop="name">
          <el-input v-model="form.name" :placeholder="$t('cdp_version_role.name.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('cdp_version_role.versionId.label')" prop="versionId">
          <el-select
            v-model="form.versionId"
            :placeholder="$t('cdp_version_role.versionId.placeholder')"
            :filter-method="versionSelectFilter"
            class="filter-item"
            filterable
          >
            <el-option
              v-for="item in versionOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="isDisabled[item.status]"
            >
              <span style="float: left; color: #8492a6; font-size: 13px">{{ item.id }}</span>
              <span style="float: right">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('cdp_version_role.tips.label')" prop="tips">
          <el-input v-model="form.tips" :placeholder="$t('cdp_version_role.tips.placeholder')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('cdp_version_role.status.label')" prop="status">
          <el-select v-model="form.status" :placeholder="$t('cdp_version_role.status.placeholder')" class="filter-item">
            <el-option v-for="item in statusOptions" :key="item" :label="item | statusFilter" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round icon="el-icon-circle-close" @click="cancel('form')">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          v-if="dialogStatus==='create'"
          round
          type="primary"
          icon="el-icon-circle-check"
          autofocus
          @click="create('form')"
        >
          {{ $t('table.confirm') }}
        </el-button>
        <el-button v-else round type="primary" icon="el-icon-circle-check" autofocus @click="update('form')">
          {{ $t('table.update') }}
        </el-button>
      </div>
    </el-dialog>
    <grantPermission ref="grantPermission" />
  </div>
</template>

<script>
import {
  getVersionRole,
  postVersionRole,
  putVersionRole,
  deleteVersionRole,
  putVersionRolePermissions,
  listVersionRolePermissions,
  listVersionRolePage
} from './versionRole'
import { formatDate } from '@/utils/date'
import { listVersion, listVersionChildPermissions } from '../version'

import { mapGetters } from 'vuex'
import grantPermission from '../../permission/grantPermission'
export default {
  name: 'DevelopmentVersionRole',
  components: {
    grantPermission
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
      versionOptions: [],
      versionList: [],
      versionId: -1,
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf',
        disabled: 'disabled'
      },
      roleList: null,
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
      rules: {
        name: [
          {
            required: true,
            message: '版本角色名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 64,
            message: '长度在 1 到 64 个字符',
            trigger: 'blur'
          }
        ],
        versionId: [
          {
            required: true,
            message: '请选择机构',
            trigger: 'blur'
          }
        ],
        value: [
          {
            required: true,
            message: '版本角色标识',
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
    ...mapGetters(['permissions', 'userInfo'])
  },
  watch: {
    filterPermissionText(val) {
      this.$refs.permissionTree.filter(val)
    }
  },
  mounted() {
    this.loadVersionAll()
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
      listVersionRolePage(this.pageModule).then(response => {
        this.roleList = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      }).catch(reason => {
        this.$notify({
          title: '获取版本角色列表失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    loadVersionAll() {
      listVersion().then(response => {
        this.versionList = response.data || []
        this.versionOptions = this.versionList
      }).catch(reason => {
        this.$notify({
          title: '查询后代机构信息失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    versionSelectFilter(input) {
      this.versionOptions = this.versionList.filter((value, index) => {
        return value.name.indexOf(input) !== -1 || value.id.indexOf(input) !== -1
      })
    },
    getVersionName: function(row, column) {
      const version = this.versionList.filter((value) => {
        return value.id === row.versionId
      })
      if (!version || version.length < 1) {
        return row.versionId
      }
      return version[0].name || row.versionId
    },
    handleFilter() {
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
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleEdit() {
      if (!this.form || !this.form.id || !this.form.name) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      getVersionRole(this.form.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      }).catch(reason => {
        this.$notify({
          title: '获取版本角色失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },

    handleVersionRolePermission(row) {
      listVersionRolePermissions(row.id).then(response => {
        this.$refs.grantPermission.initData(this, row, response.data, '126', row.versionId !== this.versionId)
        this.form = row
        this.versionId = row.versionId
      }).catch(reason => {
        this.$notify({
          title: '获取版本角色权限失败',
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
        putVersionRolePermissions(id, newRolePermissions).then(() => {
          resolve(true)
        }).catch(reason => {
          reject(reason)
        })
      })
    },
    listChildPermissions(pid) {
      return new Promise((resolve, reject) => {
        listVersionChildPermissions(pid, this.form.versionId).then((response) => {
          resolve(response)
        }).catch(reason => {
          reject(reason)
        })
      })
    },
    handleDelete() {
      if (!this.form || !this.form.id || !this.form.name) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      this.$confirm(
        '此操作将永久删除版本角色名( ' + this.form.name + ' )的相关数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteVersionRole(this.form.id).then(response => {
          this.dialogFormVisible = false
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除版本角色成功!',
            type: 'success',
            duration: 2000
          })
        }).catch(reason => {
          this.$notify({
            title: '删除版本角色失败',
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
          postVersionRole(this.form).then(() => {
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
              title: '新建版本角色失败',
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
        this.$refs[formName].resetFields()
      }
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          putVersionRole(this.form).then(() => {
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
              title: '更新版本角色信息失败',
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
        versionId: undefined,
        name: undefined,
        value: undefined,
        tips: undefined,
        status: 0
      }
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
    }
  }
}
</script>
<style scoped>
  .el-select {
    width: 100%;
  }
</style>

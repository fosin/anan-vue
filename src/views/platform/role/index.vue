<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="支持角色名称、标识" v-model="pageModule.searchText">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button v-permission="'24'" class="filter-item" style="margin-left: 10px;" @click="handleAdd" type="primary" icon="el-icon-circle-plus">{{$t('table.add')}}</el-button>
      <el-button type="success" v-permission="'25'" class="filter-item" style="margin-left: 10px;" icon="el-icon-edit" @click="handleEdit()">{{$t('table.edit')}}
      </el-button>
      <el-button type="danger" v-permission="'26'" class="filter-item" style="margin-left: 10px;" icon="el-icon-delete" @click="handleDelete()">{{$t('table.delete')}}
      </el-button>
    </div>

    <el-table :data="roleList" v-loading="listLoading" element-loading-text="努力加载中"
              border fit highlight-current-row style="width: 100%" :default-sort = "{prop: 'value', order: 'descending'}"
              @sort-change="sortChange" @row-click="rowClick">
      <el-table-column align="center" label="角色标识" sortable prop="value">
      </el-table-column>

      <el-table-column label="角色名称" sortable prop="name">
      </el-table-column>

      <el-table-column align="center" label="角色描述" sortable prop="tips">
      </el-table-column>

      <el-table-column align="center" label="创建时间" sortable prop="createTime">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | dateFormatFilter('yyyy-MM-dd HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" sortable prop="updateTime">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime | dateFormatFilter('yyyy-MM-dd HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="状态" width="80" sortable prop="status">
        <template slot-scope="scope">
          <el-tag>{{scope.row.status | statusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="权限操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" v-permission="'43'" type="primary" @click="handleRoleUser(scope.row)">{{$t('table.user')}}</el-button>
          <el-button size="mini" type="warning" v-permission="'49'" @click="handleRolePermission(scope.row)">{{$t('table.permission')}}
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageModule.pageNumber" :page-sizes="pageSizes" :page-size="pageModule.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="角色标识" prop="value">
          <el-input v-model="form.value" placeholder="角色标识"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="tips" >
          <el-input v-model="form.tips" placeholder="描述"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select class="filter-item" v-model="form.status" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item" :label="item | statusFilter" :value="item"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')" icon="el-icon-circle-close">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="create('form')" icon="el-icon-circle-check" autofocus>{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="update('form')" icon="el-icon-circle-check" autofocus>{{$t('table.update')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus] + '->' + form.name" :visible.sync="dialogPermissionVisible" width="550px">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterPermissionText">
      </el-input>
      <el-tree class="filter-tree"
               :default-checked-keys="checkedKeys"
               node-key="id"
               highlight-current
               show-checkbox
               lazy
               check-strictly
               :load="loadChildPermissions"
               :props="defaultProps"
               ref="permissionTree"
               :filter-node-method="filterNode"
               :default-expanded-keys="[1]">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('permissionTree')" icon="el-icon-circle-close">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="updatePermession(form.id, form.value)" icon="el-icon-circle-check">{{$t('table.update')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus] + ' ---> ' + form.name" :visible.sync="dialogRoleUserVisible" width="550px">
      <el-transfer ref="roleUser"
        filterable
        :filter-method="roleUserfilterMethod"
        :props = "{
          key: 'id',
          label: 'username'
        }"
        :titles="['未拥有用户', '已拥有用户']"
        v-model="roleUsers"
        :data="allUsers">
      </el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('roleUser')" icon="el-icon-circle-close">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="updateRoleUser()" icon="el-icon-circle-check">{{$t('table.update')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRole,
  postRole,
  putRole,
  deleteRole,
  listRolePage,
  putRolePermissions,
  listRolePermissions,
  listRoleUsers,
  putRoleUsers
} from './role'
import { listUser } from '../user/user'
import { formatDate } from '@/utils/date'
import { listChildPermissions } from '../permission/permission'
import waves from '@/directive/waves/index.js' // 水波纹指令
export default {
  name: 'system_role',
  directives: {
    waves
  },
  watch: {
    filterPermissionText(val) {
      this.$refs.permissionTree.filter(val)
    }
  },
  data() {
    return {
      roleUsers: [],
      allUsers: [],
      filterPermissionText: '',
      checkedKeys: [],
      expandKeys: [],
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
      pageSizes: [],
      form: {
      },
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
      }
    }
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
  created() {
    this.asyncOrganizParameterValue('DefaultPageSizes', '10,25,50,100', '表格默认每页记录数可选择项', (data) => {
      this.pageSizes = data.split(',')
    })
    listUser().then(response => {
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
  methods: {
    roleUserfilterMethod(query, item) {
      return item.usercode.indexOf(query) > -1 || item.username.indexOf(query) > -1
    },
    getList() {
      this.listLoading = true
      listRolePage(this.pageModule).then(response => {
        this.roleList = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      }).catch(reason => {
        this.$notify({
          title: '获取角色列表失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
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
      getRole(this.form.id).then(response => {
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
      listRolePermissions(row.id)
        .then(response => {
          this.checkedKeys = this.getCheckedKeys(response.data)
          this.dialogStatus = 'permission'
          this.dialogPermissionVisible = true
          this.form = row
          if (this.$refs && this.$refs.permissionTree) {
            this.$refs.permissionTree.setCheckedKeys(this.checkedKeys)
          }
        }).catch(reason => {
          this.$notify({
            title: '获取角色权限失败',
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
    updateRoleUser(id, value) {
      const userRoles = []
      for (let i = 0; i < this.roleUsers.length; i++) {
        const roleUser = {
          userId: this.roleUsers[i],
          role: { id: this.form.id },
          organizId: undefined
        }
        userRoles.push(roleUser)
      }
      putRoleUsers(this.form.id, userRoles).then(response => {
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
    updatePermession(id, value) {
      // 得到当前已展开项目中被选中的权限
      const checkedPermissions = this.$refs.permissionTree.getCheckedKeys().sort() // 当前选中的权限集合
      const halfCheckedPermissions = this.$refs.permissionTree.getHalfCheckedKeys().sort() // 当前半选中的权限集合
      const rolePermissions = this.checkedKeys.sort() // 当前角色已拥有的所有权限集合
      const expandPermissions = this.expandKeys.sort() // 树中已展开的权限集合

      // 求并集，到的所有实际被选中的权限 checkedPermissions + halfCheckedPermissions
      const allCheckedPermissions = checkedPermissions.concat(halfCheckedPermissions.filter(function(v) { return checkedPermissions.indexOf(v) === -1 })).sort()

      // 求差集
      const differencePermissions = rolePermissions.filter(function(v) { return expandPermissions.indexOf(v) === -1 })

      // 求并集
      const unionPermissions = differencePermissions.concat(allCheckedPermissions.filter(function(v) { return differencePermissions.indexOf(v) === -1 })).sort()

      // 如果没有修改过数据则直接返回
      if (unionPermissions.toString() === rolePermissions.toString()) {
        this.dialogPermissionVisible = false
        return
      }

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
      putRolePermissions(id, newRolePermissions).then(() => {
        this.dialogPermissionVisible = false
        this.$notify({
          title: '成功',
          message: '修改角色权限成功!',
          type: 'success',
          duration: 2000
        })
      }).catch(reason => {
        this.$notify({
          title: '更新角色权限失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    getCheckedKeys(rolePermissions) {
      const checkedKeys = []
      if (!rolePermissions || rolePermissions.length < 1) {
        return checkedKeys
      }
      for (let i = 0; i < rolePermissions.length; i++) {
        checkedKeys.push(rolePermissions[i].permissionId)
      }
      return checkedKeys
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    loadChildPermissions(node, resolve) {
      let pId = 0
      if (node.level !== 0) {
        pId = node.data.id
      }
      listChildPermissions(pId).then(response => {
        const childPermissions = response.data || []
        // 记录所有被展开过的节点ID，用于保存时比较数据
        for (let i = 0; i < childPermissions.length; i++) {
          const id = childPermissions[i].id
          this.expandKeys.push(id)
          // childPermissions[i].disabled = pId === 0
        }
        return resolve(childPermissions)
      }).catch(reason => {
        this.$notify({
          title: '加载子节点失败',
          message: reason.message,
          type: 'error',
          duration: 5000
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
        '此操作将永久删除角色名( ' + this.form.name + ' )的相关数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteRole(this.form.id).then(response => {
          this.dialogFormVisible = false
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除角色成功!',
            type: 'success',
            duration: 2000
          })
        }).catch(reason => {
          this.$notify({
            title: '删除角色失败',
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
          postRole(this.form).then(() => {
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
            this.getList()
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

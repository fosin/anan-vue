<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 300px;" class="filter-item" placeholder="支持用户工号、名称、手机号、邮箱查找" v-model="pageModule.searchText">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button v-permission="'12'" class="filter-item" style="margin-left: 10px;" @click="handleAdd" type="primary" icon="el-icon-circle-plus">{{$t('table.add')}}</el-button>
      <el-button v-permission="'14'" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="handleEdit">{{$t('table.edit')}}
      </el-button>
      <el-button v-permission="'15'" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="handleDelete">{{$t('table.delete')}}
      </el-button>
      <el-button v-permission="'27'" class="filter-item" style="margin-left: 10px;" icon="el-icon-bell" type="info" @click="handleResetPass">{{$t('table.resetPass')}}
      </el-button>
    </div>

    <el-table :data="list" v-loading="listLoading"
              element-loading-text="努力加载中..." border fit highlight-current-row
              :row-class-name="tableRowClassName"
              style="width: 100%"  :default-sort = "{prop: 'usercode', order: 'descending'}"
             @sort-change="sortChange" @row-click="rowClick">
      <el-table-column align="center" label="工号" width="80" sortable prop="usercode">
      </el-table-column>
      <el-table-column align="center" label="名称" sortable prop="username" width="140">
        <template slot-scope="scope">
          <span>
            <img v-if="scope.row.avatar" class="user-avatar" style="width: 20px; height: 20px; border-radius: 50%;" :src="scope.row.avatar+'?imageView2/1/w/20/h/20'"> {{scope.row.username}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" width="80" sortable prop="sex">
        <template slot-scope="scope">
          <span>{{getSexName(scope.row.sex)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="生日" sortable prop="birthday" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.birthday | dateFormatFilter('yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" sortable prop="phone"  width="130">
      </el-table-column>
      <el-table-column align="center" label="邮箱" sortable prop="email"  width="150">
      </el-table-column>
      <el-table-column prop="organizId" align="center" label="所属机构"
                       show-overflow-tooltip :formatter="getOrganizName" sortable>
      </el-table-column>
     <!-- <el-table-column align="center" label="创建时间" sortable prop="createTime">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | dateFormatFilter('yyyy-MM-dd HH:mm:ss')}}</span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" class-name="status-col" label="状态" width="80" sortable prop="status">
        <template slot-scope="scope">
          <el-tag>{{scope.row.status | statusFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="权限操作" width="200">
        <template slot-scope="scope">
          <el-button v-permission="'42'" size="mini" type="primary" @click="handleUserRole(scope.row)">{{$t('table.role')}}</el-button>
          <el-button v-permission="'48'" size="mini" type="warning" @click="handleUserPermission(scope.row)">{{$t('table.permission')}}</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageModule.pageNumber" :page-sizes="pageSizes" :page-size="pageModule.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户工号" prop="usercode">
              <el-input v-model="form.usercode" placeholder="请输入用户工号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="dialogStatus === 'create'" label="密码" placeholder="如果不填密码系统将随机生成" prop="password">
              <el-input type="password" v-model="form.password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生日" prop="birthday">
              <el-date-picker
                v-model="form.birthday"
                align="right"
                type="date"
                placeholder="请选择用户生日"
                :picker-options="pickerBirthday"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="16">
            <el-form-item label="所属机构" prop="organizId">
                <el-select class="filter-item" v-model="form.organizId" filterable placeholder="请选择机构" :filter-method="organizSelectFilter">
                  <el-option v-for="item in oraganizOptions" :key="item.id" :label="item.fullname || item.name" :value="item.id" :disabled="isDisabled[item.status]">
                    <span style="float: left; color: #8492a6; font-size: 13px">{{ item.code }}</span>
                    <span style="float: right">{{ item.fullname || item.name }}</span>
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="sex">
              <el-select class="filter-item" v-model="form.sex" placeholder="请选择性别">
                <el-option v-for="item in sexOptions" :key="item.name" :label="item.value" :value="item.name"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
       <!-- <el-form-item label="角色" prop="role">
          <el-select class="filter-item" v-model="selectedRoles" placeholder="请选择" multiple>
            <el-option v-for="item in rolesOptions" :key="item.id" :label="item.name" :value="item.id" :disabled="isDisabled[item.status]">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="用户头像" prop="avatar">
          <el-input v-model="form.avatar" placeholder="请输入用户头像连接地址"></el-input>
        </el-form-item>

        <el-row >
          <el-col :span="10">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="员工邮箱地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" placeholder="验证码登录使用"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <el-select class="filter-item" v-model="form.status" placeholder="请选择">
                <el-option v-for="item in statusOptions" :key="item" :label="item | statusFilter" :value="item"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="到期时间" prop="expireTime">
          <el-date-picker
            v-model="form.expireTime"
            align="right"
            type="date"
            placeholder="请选择用户到期时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')" icon="el-icon-circle-close">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus==='create'" autofocus type="primary" @click="create('form')" icon="el-icon-circle-check">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" autofocus @click="update('form')" icon="el-icon-circle-check">{{$t('table.update')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus] + ' ---> ' + form.username" :visible.sync="dialogUserRoleVisible" width="550px">
      <el-transfer ref="userRole"
                   filterable
                   :filter-method="userRolefilterMethod"
                   :props = "{
                      key: 'id',
                      label: 'name'
                    }"
                   :titles="['未拥有角色', '已拥有角色']"
                   v-model="userRoles"
                   :data="rolesOptions">
      </el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('userRole')" icon="el-icon-circle-close">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="updateUserRole()" icon="el-icon-circle-check">{{$t('table.update')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus] + ' ---> ' + form.username" :visible.sync="dialogUserPermissionVisible" width="550px">
      <el-tabs type="border-card">
        <el-tab-pane label="增加权限">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterAddPermissionText">
          </el-input>
          <el-tree class="filter-tree"
                   :default-checked-keys="addCheckedKeys"
                   node-key="id"
                   highlight-current
                   show-checkbox
                   lazy
                   check-strictly
                   :load="loadChildAddPermissions"
                   :props="defaultProps"
                   ref="addPermissionTree"
                   :filter-node-method="filterNode"
                   :default-expanded-keys="[1]">
          </el-tree>
        </el-tab-pane>
        <el-tab-pane label="减少权限">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterSubPermissionText">
          </el-input>
          <el-tree class="filter-tree"
                   node-key="id"
                   :default-checked-keys="subCheckedKeys"
                   highlight-current
                   show-checkbox
                   lazy
                   check-strictly
                   :load="loadChildSubPermissions"
                   :props="defaultProps"
                   ref="subPermissionTree"
                   :filter-node-method="filterNode"
                   :default-expanded-keys="[1]">
          </el-tree>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('permissionTree')" icon="el-icon-circle-close">{{$t('table.cancel')}}</el-button>
        <el-button type="primary" @click="updateUserPermession()" icon="el-icon-circle-check">{{$t('table.update')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUserPage, getUser, postUser, putUser, deleteUser, resetPassword,
  putUserPermissions,
  listUserPermissions,
  listUserRoles, putUserRoles } from './user'
import { listChildPermissions } from '../permission/permission'
import { formatDate } from '@/utils/date'
import { listRole } from '../role/role'
import { listOrganizAllChild, treeOrganiz, listOrganiz } from '../organization/organization'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { mapGetters } from 'vuex'
import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
import ElOption from 'element-ui/packages/select/src/option'

export default {
  name: 'system_user',
  components: {
    ElOption,
    ElRadioGroup
  },
  directives: {
    waves
  },
  watch: {
    filterAddPermissionText(val) {
      this.$refs.addPermissionTree.filter(val)
    },
    filterSubPermissionText(val) {
      this.$refs.subPermissionTree.filter(val)
    }
  },
  data() {
    return {
      filterAddPermissionText: '',
      filterSubPermissionText: '',
      addCheckedKeys: [],
      subCheckedKeys: [],
      addExpandKeys: [],
      subExpandKeys: [],
      userRoles: [],
      organizTree: [],
      checkedKeys: [],
      list: [],
      total: 0,
      listLoading: true,
      pageModule: {
        pageNumber: 1,
        pageSize: 10,
        searchText: '',
        sortName: '',
        sortOrder: ''
      },
      pageSizes: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf',
        disabled: 'disabled'
      },
      selectedRoles: [],
      form: {},
      pickerBirthday: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      rules: {
        expireTime: [
          {
            required: true,
            message: '请输入账户到期时间',
            trigger: 'blur'
          }
        ],
        usercode: [
          {
            required: true,
            message: '请输入账户',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        username: [
          {
            required: true,
            message: '请输入用户姓名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 30,
            message: '长度在 1 到 30 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
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
        selectedRoles: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            message: '手机号',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '长度在11 个字符',
            trigger: 'blur'
          }
        ]
      },
      statusOptions: [0, 1, 9],
      sexOptions: [1, 2, 9],
      rolesOptions: [],
      oraganizOptions: [],
      organizList: [],
      dialogFormVisible: false,
      dialogUserRoleVisible: false,
      dialogUserPermissionVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        role: '分配角色',
        permission: '分配权限'
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
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '有效',
        1: '禁用',
        9: '锁定'
      }
      return statusMap[status]
    },
    dateFormatFilter(date, pattern) {
      return formatDate(date, pattern || 'yyyy-MM-dd HH:mm:ss')
    }
  },
  created() {
    if (!this.organizList || this.organizList.length < 1) {
      this.loadOrganizAllChild(this.userInfo.organizId)
    }
    this.asyncLoadDictionaryByCode(15, (data) => {
      this.sexOptions = data
    })
    this.asyncOrganizParameterValue('DefaultPageSize', '10', '表格默认每页记录数', (data) => {
      this.pageModule.pageSize = data
    })
    this.asyncOrganizParameterValue('DefaultPageSizes', '10,25,50,100', '表格默认每页记录数可选择项', (data) => {
      this.pageSizes = data.split(',')
    })
    this.loadRoles()
    this.resetTemp()
  },
  methods: {
    userRolefilterMethod(query, item) {
      return item.name.indexOf(query) > -1 || item.value.indexOf(query) > -1
    },
    getSexName(type) {
      const typeOption = this.sexOptions.filter(value => {
        return value.name === type
      })
      return typeOption.length > 0 ? typeOption[0].value : type
    },
    tableRowClassName({ row, rowIndex }) {
      switch (row.status) {
        case 1:
          return 'info-row'
        case 9:
          return 'info-row'
        default:
          return ''
      }
    },
    getList() {
      this.listLoading = true
      listUserPage(this.pageModule).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      }).catch(reason => {
        this.$notify({
          title: '查询所有用户失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    updateList(data) {
      if (!data || !data.id) {
        return
      }
      let index = this.list.length + 1
      for (let i = 0; i < this.list.length; i++) {
        const user = this.list[i]
        if (data.id === user.id) {
          index = i
          break
        }
      }
      this.list[index] = data
    },
    deleteList(id) {
      if (!id) {
        return
      }
      for (let i = 0; i < this.list.length; i++) {
        const user = this.list[i]
        if (id === user.id) {
          this.list.splice(i, 1)
          break
        }
      }
    },
    loadOrganizAllChild(pId) {
      listOrganizAllChild(pId).then(response => {
        this.organizList = response.data || []
      }).catch(reason => {
        this.$notify({
          title: '查询后代机构信息失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
      this.oraganizOptions = this.organizList
    },
    loadOrganizTree() {
      if (!this.organizTree || this.organizTree.length < 1) {
        treeOrganiz().then(response => {
          this.organizTree = response.data || []
        }).catch(reason => {
          this.$notify({
            title: '查询机构信息失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      }
    },
    loadOrganizList() {
      listOrganiz().then(response => {
        this.organizList = response.data || []
      }).catch(reason => {
        this.$notify({
          title: '查询机构信息失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
      this.oraganizOptions = this.organizList
    },
    organizSelectFilter(input) {
      this.oraganizOptions = this.organizList.filter((value, index) => {
        return value.name.indexOf(input) !== -1 || value.id.indexOf(input) !== -1 || value.fullname.indexOf(input) !== -1
      })
    },
    getOrganizName: function(row, column) {
      const organiz = this.organizList.filter((value) => {
        return value.id === row.organizId
      })
      if (!organiz || organiz.length < 1) {
        return row.organizId
      }
      return organiz[0].fullname || organiz[0].name || row.organizId
    },
    loadRoles() {
      listRole().then(response => {
        this.rolesOptions = response.data || []
      }).catch(reason => {
        this.$notify({
          title: '获取所有角色失败',
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
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleEdit() {
      if (!this.form || !this.form.id || !this.form.username) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      getUser(this.form.id).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
        this.selectedRoles = []
        const userRoles = this.form.userRoles
        if (userRoles && userRoles.length) {
          for (let i = 0; i < userRoles.length; i++) {
            this.selectedRoles.push(userRoles[i].role.id)
          }
        }
        this.oraganizOptions = this.organizList
      }).catch((reason) => {
        this.$notify({
          title: '获取用户信息失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    handleResetPass() {
      if (!this.form || !this.form.id || !this.form.username) {
        this.$message({
          message: '重置密码前请先选择一条用户数据!'
        })
        return
      }
      this.$confirm(
        '确定要重置用户名( ' + this.form.username + ' )的密码吗?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        resetPassword(this.form.id)
          .then((response) => {
            this.$notify({
              title: '重置密码成功',
              message: '用户[' + this.form.username + ']当前密码是:' + response.data,
              type: 'success',
              duration: 0
            })
          })
          .catch((reason) => {
            this.$notify({
              title: '重置密码失败',
              message: reason.message,
              type: 'error',
              duration: 5000
            })
          })
      }).catch(() => {})
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    loadChildAddPermissions(node, resolve) {
      let pId = 0
      if (node.level !== 0) {
        pId = node.data.id
      }
      listChildPermissions(pId).then(response => {
        const childPermissions = response.data || []
        // 记录所有被展开过的节点ID，用于保存时比较数据
        for (let i = 0; i < childPermissions.length; i++) {
          const id = childPermissions[i].id
          this.addExpandKeys.push(id)
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
    loadChildSubPermissions(node, resolve) {
      let pId = 0
      if (node.level !== 0) {
        pId = node.data.id
      }
      listChildPermissions(pId).then(response => {
        const childPermissions = response.data || []
        // 记录所有被展开过的节点ID，用于保存时比较数据
        for (let i = 0; i < childPermissions.length; i++) {
          const id = childPermissions[i].id
          this.subExpandKeys.push(id)
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
    handleUserPermission(row) {
      listUserPermissions(row.id).then(response => {
        this.addCheckedKeys = this.getCheckedKeys(1, response.data)
        this.subCheckedKeys = this.getCheckedKeys(2, response.data)
        this.dialogStatus = 'permission'
        this.dialogUserPermissionVisible = true
        this.form = row
        if (this.$refs) {
          if (this.$refs.addPermissionTree) {
            this.$refs.addPermissionTree.setCheckedKeys(this.addCheckedKeys)
          }
          if (this.$refs.subPermissionTree) {
            this.$refs.subPermissionTree.setCheckedKeys(this.subCheckedKeys)
          }
        }
      }).catch(reason => {
        this.$notify({
          title: '获取用户权限失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    getUserAddPermession(userHavePermission) {
      // 得到当前已展开项目中被选中的权限
      const checkedPermissions = this.$refs.addPermissionTree.getCheckedKeys().sort() // 当前选中的权限集合
      const halfCheckedPermissions = this.$refs.addPermissionTree.getHalfCheckedKeys().sort() // 当前半选中的权限集合
      const expandPermissions = this.addExpandKeys.sort() // 树中已展开的权限集合

      // 求并集，到的所有实际被选中的权限 checkedPermissions + halfCheckedPermissions
      const allCheckedPermissions = checkedPermissions.concat(halfCheckedPermissions.filter(function(v) { return checkedPermissions.indexOf(v) === -1 })).sort()

      // 求差集
      const differencePermissions = userHavePermission.filter(function(v) { return expandPermissions.indexOf(v) === -1 })

      // 求并集
      const unionPermissions = differencePermissions.concat(allCheckedPermissions.filter(function(v) { return differencePermissions.indexOf(v) === -1 })).sort()

      return unionPermissions
    },
    getUserSubPermession(userHavePermission) {
      // 得到当前已展开项目中被选中的权限
      const checkedPermissions = this.$refs.subPermissionTree.getCheckedKeys().sort() // 当前选中的权限集合
      const halfCheckedPermissions = this.$refs.subPermissionTree.getHalfCheckedKeys().sort() // 当前半选中的权限集合
      const expandPermissions = this.subExpandKeys.sort() // 树中已展开的权限集合

      // 求并集，到的所有实际被选中的权限 checkedPermissions + halfCheckedPermissions
      const allCheckedPermissions = checkedPermissions.concat(halfCheckedPermissions.filter(function(v) { return checkedPermissions.indexOf(v) === -1 })).sort()

      // 求差集
      const differencePermissions = userHavePermission.filter(function(v) { return expandPermissions.indexOf(v) === -1 })

      // 求并集
      const unionPermissions = differencePermissions.concat(allCheckedPermissions.filter(function(v) { return differencePermissions.indexOf(v) === -1 })).sort()

      return unionPermissions
    },
    updateUserPermession() {
      const userAddPermissions = this.addCheckedKeys.sort() // 当前用户原拥有的加权限集合
      const resultAddPermission = this.getUserAddPermession(userAddPermissions)

      const userSubPermissions = this.subCheckedKeys.sort() // 当前用户原拥有的减权限集合
      const resultSubPermission = this.getUserSubPermession(userSubPermissions)

      // 如果没有修改过数据则直接返回
      if (resultAddPermission.toString() === userAddPermissions.toString() && resultSubPermission.toString() === userSubPermissions.toString()) {
        this.dialogUserPermissionVisible = false
        return
      }

      // 组装成后台需要的数据格式
      const newRolePermissions = []
      for (let i = 0; i < resultAddPermission.length; i++) {
        const permission = {
          id: undefined,
          organizId: this.form.organizId,
          userId: this.form.id,
          addMode: 0,
          permissionId: resultAddPermission[i]
        }
        newRolePermissions.push(permission)
      }
      for (let i = 0; i < resultSubPermission.length; i++) {
        const permission = {
          id: undefined,
          organizId: this.form.organizId,
          userId: this.form.id,
          addMode: 1,
          permission: {
            id: resultSubPermission[i]
          }
        }
        newRolePermissions.push(permission)
      }
      putUserPermissions(this.form.id, newRolePermissions).then(() => {
        this.dialogUserPermissionVisible = false
        this.$notify({
          title: '成功',
          message: '修改用户权限成功!',
          type: 'success',
          duration: 2000
        })
      }).catch(reason => {
        this.$notify({
          title: '更新用户权限失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    getCheckedKeys(type, permissions) {
      const checkedKeys = []
      if (!permissions || permissions.length < 1) {
        return checkedKeys
      }
      for (let i = 0; i < permissions.length; i++) {
        const permission = permissions[i]
        if (type === 1) {
          if (permission.addMode === 0) {
            checkedKeys.push(permission.permissionId)
          }
        } else {
          if (permissions[i].addMode === 1) {
            checkedKeys.push(permission.permissionId)
          }
        }
      }
      return checkedKeys
    },
    handleUserRole(row) {
      listUserRoles(row.id).then(response => {
        this.dialogStatus = 'role'
        this.dialogUserRoleVisible = true
        this.form = row
        const userRoles = response.data
        this.userRoles = []
        for (let i = 0; i < userRoles.length; i++) {
          const role = userRoles[i].id
          this.userRoles.push(role)
        }
      }).catch(reason => {
        this.$notify({
          title: '获取用户角色失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    updateUserRole() {
      const userRoles = []
      for (let i = 0; i < this.userRoles.length; i++) {
        const roleUser = {
          userId: this.form.id,
          role: { id: this.userRoles[i] },
          organizId: this.form.organizId
        }
        userRoles.push(roleUser)
      }
      putUserRoles(this.form.id, userRoles).then(response => {
        this.dialogUserRoleVisible = false
        this.$notify({
          title: '成功',
          message: '更新用户角色成功!',
          type: 'success',
          duration: 2000
        })
      }).catch(reason => {
        this.$notify({
          title: '更新用户角色失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    create(formName) {
      const set = this.$refs
      for (let i = 0; i < this.selectedRoles.length; i++) {
        const userRole = {
          organizId: this.form.organizId,
          userId: this.form.id,
          role: {
            id: this.selectedRoles[i]
          }
        }
        this.form.userRoles.push(userRole)
      }
      set[formName].validate(valid => {
        if (valid) {
          postUser(this.form).then((response) => {
            this.dialogFormVisible = false
            this.updateList(this.form)
            this.$notify({
              title: '创建成功,用户[' + this.form.username + ']密码是:',
              message: response.data.password,
              type: 'success',
              duration: 0
            })
          }).catch(reason => {
            this.$notify({
              title: '保存用户失败',
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
      this.dialogUserRoleVisible = false
      this.dialogUserPermissionVisible = false
      if (formName === 'form') {
        this.$refs[formName].resetFields()
      }
    },
    update(formName) {
      const set = this.$refs
      const oldUseRoles = this.form.userRoles
      this.form.userRoles = []
      for (let i = 0; i < this.selectedRoles.length; i++) {
        let userRole = {
          organizId: this.form.organizId,
          userId: this.form.id,
          role: {
            id: this.selectedRoles[i]
          }
        }
        for (let j = 0; j < oldUseRoles.length; j++) {
          if (oldUseRoles[j].role.id === this.selectedRoles[i]) {
            userRole = oldUseRoles[j]
            userRole.organizId = this.form.organizId
          }
        }
        this.form.userRoles.push(userRole)
      }
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          putUser(this.form).then(() => {
            this.dialogFormVisible = false
            this.updateList(this.form)
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          }).catch(reason => {
            this.$notify({
              title: '更新用户信息失败',
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
    handleDelete() {
      if (!this.form || !this.form.id || !this.form.username) {
        this.$message({
          message: '重置密码前请先选择一条用户数据!'
        })
        return
      }
      this.$confirm(
        '此操作将永久删除用户名( ' + this.form.username + ' )的相关数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteUser(this.form.id)
          .then(() => {
            this.deleteList(this.form.id)
            this.$notify({
              title: '成功',
              message: '删除用户成功',
              type: 'success',
              duration: 2000
            })
          }).catch((reason) => {
            this.$notify({
              title: '删除用户失败',
              message: reason.message,
              type: 'error',
              duration: 5000
            })
          })
      }).catch(() => {})
    },
    resetTemp() {
      this.selectedRoles = []
      this.oraganizOptions = this.organizList
      this.form = {
        username: undefined,
        organizId: undefined,
        organizName: undefined,
        phone: undefined,
        email: undefined,
        birthday: undefined,
        avatar: undefined,
        id: undefined,
        usercode: undefined,
        password: '123456',
        userRoles: [],
        status: 0,
        sex: 1,
        expireTime: new Date('2050-12-31 23:59:59')
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

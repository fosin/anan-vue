<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 300px;" class="filter-item" placeholder="支持用户工号、名称、手机号、邮箱查找" v-model="pageModule.searchText">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button v-permission="'system_user_add'" class="filter-item" style="margin-left: 10px;" @click="handleAdd" type="primary" icon="el-icon-circle-plus">{{$t('table.add')}}</el-button>
      <el-button v-permission="'system_user_edit'" class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="handleEdit">{{$t('table.edit')}}
      </el-button>
      <el-button v-permission="'system_user_delete'" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="handleDelete">{{$t('table.delete')}}
      </el-button>
      <el-button v-permission="'system_user_resetPass'" class="filter-item" style="margin-left: 10px;" icon="el-icon-bell" type="info" @click="handleResetPass">{{$t('table.resetPass')}}
      </el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading"
              element-loading-text="努力加载中..." border fit highlight-current-row
              :row-class-name="tableRowClassName"
              style="width: 100%"  :default-sort = "{prop: 'usercode', order: 'descending'}"
             @sort-change="sortChange" @row-click="rowClick">
      <el-table-column align="center" label="工号" width="80" sortable prop="usercode">
      </el-table-column>
      <el-table-column align="center" label="名称" sortable prop="username">
        <template slot-scope="scope">
          <span>
            <img v-if="scope.row.avatar" class="user-avatar" style="width: 20px; height: 20px; border-radius: 50%;" :src="scope.row.avatar+'?imageView2/1/w/20/h/20'"> {{scope.row.username}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" width="80" sortable prop="sex">
        <template slot-scope="scope">
          <el-tag>{{scope.row.sex | sexFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="生日" sortable prop="birthday">
        <template slot-scope="scope">
          <span>{{scope.row.birthday | dateFormatFilter('yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" sortable prop="phone">
      </el-table-column>
      <el-table-column align="center" label="邮箱" sortable prop="email">
      </el-table-column>
      <el-table-column prop="organizId" align="center" label="所属机构"
                       show-overflow-tooltip :formatter="getOrganizName" sortable>
      </el-table-column>

      <!--<el-table-column align="center" label="角色">
        <template slot-scope="scope">
          <span v-for="role in scope.row.userRoles">{{role.role.name}} </span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="创建时间" sortable prop="createTime">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | dateFormatFilter('yyyy-MM-dd HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="状态" width="80" sortable prop="status">
        <template slot-scope="scope">
          <el-tag>{{scope.row.status | statusFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="权限操作" width="200">
        <template slot-scope="scope">
          <el-button v-permission="'system_user_role'" size="mini" type="primary" @click="handleUserRole(scope.row)">{{$t('table.role')}}</el-button>
          <el-button v-permission="'system_user_permission'" size="mini" type="warning" @click="handleUserPermission(scope.row)">{{$t('table.permission')}}</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageModule.pageNumber" :page-sizes="[10,25,50,100]" :page-size="pageModule.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
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
                    <span style="float: left; color: #8492a6; font-size: 13px">{{ item.id }}</span>
                    <span style="float: right">{{ item.fullname || item.name }}</span>
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="sex">
              <el-select class="filter-item" v-model="form.sex" placeholder="请选择性别">
                <el-option v-for="item in sexOptions" :key="item" :label="item | sexFilter" :value="item"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="角色" prop="role">
          <el-select class="filter-item" v-model="selectedRoles" placeholder="请选择" multiple>
            <el-option v-for="item in rolesOptions" :key="item.id" :label="item.name" :value="item.id" :disabled="isDisabled[item.status]">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')" icon="el-icon-circle-close">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus==='create'" autofocus type="primary" @click="create('form')" icon="el-icon-circle-check">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" autofocus @click="update('form')" icon="el-icon-circle-check">{{$t('table.update')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUserPage, getUser, postUser, putUser, deleteUser, resetPassword } from '@/api/user'
import { formatDate } from '@/utils/date'
import { listRole } from '@/api/role'
import { listOrganizChild, treeOrganiz, listOrganiz } from '@/api/organization'
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
  data() {
    return {
      organizTree: [],
      checkedKeys: [],
      list: [],
      total: 0,
      listLoading: true,
      pageModule: {
        pageNumber: 1,
        pageSize: 25,
        searchText: '',
        sortName: '',
        sortOrder: ''
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
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      isDisabled: {
        0: false,
        1: true
      },
      tableKey: 0
    }
  },
  computed: {
    ...mapGetters(['permissions'])
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
    sexFilter(status) {
      const statusMap = {
        1: '男',
        2: '女',
        9: '未知'
      }
      return statusMap[status]
    },
    dateFormatFilter(date, pattern) {
      return formatDate(date, pattern || 'yyyy-MM-dd HH:mm:ss')
    }
  },
  created() {
    this.resetTemp()
    this.loadOrganizList()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      switch (row.status) {
        case 1:
          return 'info-row'
        case 9:
          return 'warning-row'
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
    loadOrganizChild(node, resolve) {
      let pId = '0'
      if (node.level !== 0) {
        pId = node.data.id
      }
      listOrganizChild(pId).then(response => {
        return resolve(response.data.data || [])
      }).catch(reason => {
        this.$notify({
          title: '查询子机构信息失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    loadOrganizTree() {
      if (!this.organizTree || this.organizTree.length < 1) {
        treeOrganiz().then(response => {
          this.organizTree = response.data.data || []
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
      if (!this.organizList || this.organizList.length < 1) {
        listOrganiz().then(response => {
          this.organizList = response.data.data || []
        }).catch(reason => {
          this.$notify({
            title: '查询机构信息失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      }
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
      if (!this.rolesOptions || this.rolesOptions.length < 1) {
        listRole().then(response => {
          this.rolesOptions = response.data.data || []
        }).catch(reason => {
          this.$notify({
            title: '查询角色失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      }
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
      this.loadRoles()
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
        this.form = response.data.data
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
        this.loadRoles()
      }).catch((reason) => {
        this.$notify({
          title: '提示',
          message: '获取用户信息出现一个错误:' + reason.message,
          type: 'warning',
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
              title: '成功',
              message: '重置密码成功,用户(' + this.form.username + ')当前密码是:' + response.data.data,
              type: 'success',
              duration: 5000
            })
          })
          .catch((reason) => {
            this.$notify({
              title: '失败',
              message: '重置密码失败:' + reason.message,
              type: 'error',
              duration: 5000
            })
          })
      }).catch(() => {})
    },
    handleUserPermission(row) {
      this.$message({
        message: '该方法还未实现，敬请期待!'
      })
    },
    handleUserRole(row) {
      this.$message({
        message: '该方法还未实现，敬请期待!'
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
              title: '创建成功,当前用户密码是:',
              message: response.data.data.password,
              type: 'success',
              duration: 2000
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
      this.$refs[formName].resetFields()
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
        sex: 1
      }
    },
    sortChange(column) {
      this.pageModule.sortOrder = column.column.order === 'descending' ? 'DESC' : 'ASC'
      this.pageModule.sortName = column.column.property
      this.getList()
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

  .el-table .warning-row {
    color: #E6A23C;
  }

  .el-table .success-row {
    color: #67C23A;
  }

  .el-table .danger-row {
    color: #F56C6C;
  }

  .el-table .info-row {
    color: #909399;
  }
</style>

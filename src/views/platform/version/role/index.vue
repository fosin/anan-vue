<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="支持版本角色名称、标识"
                v-model="pageModule.searchText">
      </el-input>
      <el-button round class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">
        {{$t('table.search')}}
      </el-button>
      <el-button round v-permission="'121'" class="filter-item" style="margin-left: 10px;" @click="handleAdd"
                 type="primary" icon="el-icon-circle-plus">{{$t('table.add')}}
      </el-button>
      <el-button round type="success" v-permission="'122'" class="filter-item" style="margin-left: 10px;"
                 icon="el-icon-edit" @click="handleEdit()">{{$t('table.edit')}}
      </el-button>
      <el-button round type="danger" v-permission="'123'" class="filter-item" style="margin-left: 10px;"
                 icon="el-icon-delete" @click="handleDelete()">{{$t('table.delete')}}
      </el-button>
    </div>

    <el-table :data="roleList" v-loading="listLoading" element-loading-text="努力加载中"
              border fit highlight-current-row style="width: 100%" :default-sort="{prop: 'value', order: 'descending'}"
              @sort-change="sortChange" @row-click="rowClick">
      <el-table-column align="center" label="角色标识" sortable prop="value">
      </el-table-column>

      <el-table-column label="角色名称" align="center" sortable prop="name">
      </el-table-column>
      <el-table-column prop="versionId" align="center" label="所属版本"
                       show-overflow-tooltip :formatter="getVersionName" sortable>
      </el-table-column>
      
      <el-table-column align="center" label="创建时间" sortable prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | dateFormatFilter('yyyy-MM-dd HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" sortable prop="updateTime" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime | dateFormatFilter('yyyy-MM-dd HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="状态" width="80" sortable prop="status">
        <template slot-scope="scope">
          <el-tag>{{scope.row.status | statusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="权限操作" width="100">
        <template slot-scope="scope">
          <el-button round size="mini" type="warning" v-permission="'126'" @click="handleVersionRolePermission(scope.row)">
            {{$t('table.permission')}}
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="pageModule.pageNumber" :page-sizes="pageSizes" :page-size="pageModule.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="角色标识" prop="value">
          <el-input v-model="form.value" placeholder="版本角色标识"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="版本角色名称"></el-input>
        </el-form-item>
        <el-form-item label="所属版本" prop="versionId">
          <el-select class="filter-item" v-model="form.versionId" filterable placeholder="请选择所属版本"
                     :filter-method="versionSelectFilter">
            <el-option v-for="item in versionOptions" :key="item.id" :label="item.name"
                       :value="item.id" :disabled="isDisabled[item.status]">
              <span style="float: left; color: #8492a6; font-size: 13px">{{ item.id }}</span>
              <span style="float: right">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="tips">
          <el-input v-model="form.tips" placeholder="描述"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select class="filter-item" v-model="form.status" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item" :label="item | statusFilter" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round @click="cancel('form')" icon="el-icon-circle-close">{{$t('table.cancel')}}</el-button>
        <el-button round v-if="dialogStatus==='create'" type="primary" @click="create('form')"
                   icon="el-icon-circle-check" autofocus>{{$t('table.confirm')}}
        </el-button>
        <el-button round v-else type="primary" @click="update('form')" icon="el-icon-circle-check" autofocus>
          {{$t('table.update')}}
        </el-button>
      </div>
    </el-dialog>
    <grantPermission ref="grantPermission" @close="hackReset = false" v-if="hackReset"></grantPermission>
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
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import { mapGetters } from 'vuex'
  import grantPermission from '../../permission/grantPermission'
  export default {
    name: 'development_versionRole',
    directives: {
      waves
    },
    watch: {
      filterPermissionText(val) {
        this.$refs.permissionTree.filter(val)
      }
    },
    computed: {
      ...mapGetters(['permissions', 'userInfo'])
    },
    components: {
      grantPermission
    },
    data() {
      return {
        versionOptions: [],
        versionList: [],
        hackReset: false,
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
      this.loadVersionAll()
      this.asyncOrganizParameterValue('DefaultPageSize', '10', '表格默认每页记录数', (data) => {
        this.pageModule.pageSize = parseInt(data)
      })
      this.asyncOrganizParameterValue('DefaultPageSizes', '5,10,25,50,100', '表格默认每页记录数可选择项', (data) => {
        const temp = data.split(',')
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
        this.hackReset = false
        this.$nextTick(() => {
          this.hackReset = true
        })
        listVersionRolePermissions(row.id).then(response => {
          this.form = row
          this.$refs.grantPermission.initData(this, this.form, response.data)
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
      listChildPermissions(pId) {
        return new Promise((resolve, reject) => {
          listVersionChildPermissions(pId, this.form.versionId).then((response) => {
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

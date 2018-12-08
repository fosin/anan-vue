<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleSearch" style="width: 200px;" class="filter-item" placeholder="支持标识、密钥查找" v-model="pageModule.searchText">
      </el-input>
      <el-button round class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleSearch">{{$t('table.search')}}</el-button>
      <el-button round v-permission="'50'" class="filter-item" style="margin-left: 10px;" @click="handleAdd" type="primary" icon="el-icon-circle-plus">{{$t('table.add')}}</el-button>
      <el-button round type="success" v-permission="'51'" class="filter-item" style="margin-left: 10px;" icon="el-icon-edit" @click="handleEdit()">{{$t('table.edit')}}
      </el-button>
      <el-button round type="danger" v-permission="'52'" class="filter-item" style="margin-left: 10px;" icon="el-icon-delete" @click="handleDelete()">{{$t('table.delete')}}
      </el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="努力加载中"
              border fit highlight-current-row style="width: 100%" :default-sort = "{prop: 'clientId', order: 'ascending'}"
              @sort-change="sortChange" @row-click="rowClick">
      <el-table-column align="center" label="客户端标识" sortable prop="clientId"></el-table-column>

    <!--  <el-table-column align="center" label="客户端密钥" sortable prop="clientSecret"></el-table-column>
-->
      <el-table-column align="center" label="作用域" sortable prop="scope"></el-table-column>

      <el-table-column align="center" label="授权类型" sortable prop="authorizedGrantTypes" width="250px">
      </el-table-column>
      <el-table-column align="center" label="重定向地址" sortable prop="webServerRedirectUri"></el-table-column>

      <el-table-column align="center" label="令牌期效" sortable prop="accessTokenValidity">
      </el-table-column>
      <el-table-column align="center" label="刷新令牌期效" sortable prop="refreshTokenValidity">
      </el-table-column>
     <!--
      <el-table-column align="center" class-name="status-col" label="资源信息" sortable prop="resourceIds">
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="权限信息" sortable prop="authorities">
      </el-table-column>
     <el-table-column align="center" class-name="status-col" label="权限" sortable prop="additionalInformation">
      </el-table-column>-->
      <el-table-column align="center"  label="自动授权" sortable prop="autoapprove">
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button round size="mini" type="warning" @click="handlePermission(scope.row)">{{$t('table.permission')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageModule.pageNumber" :page-sizes="pageSizes" :page-size="pageModule.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="dialogStatus === 'create'" label="客户端标识" prop="clientId" >
              <el-input v-model="form.clientId" placeholder="客户端标识"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作用域" prop="scope">
              <el-input v-model="form.scope" placeholder="作用域"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="客户端密钥" prop="clientSecret">
          <el-input v-model="form.clientSecret" placeholder="客户端密钥"></el-input>
        </el-form-item>
        <el-form-item label="授权类型" prop="authorizedGrantTypeArray">
          <el-select  v-model="form.authorizedGrantTypeArray" filterable placeholder="请选择授权类型(支持多选)" multiple>
            <el-option v-for="item in grantTypesOptions" :key="item.scode"
                       :label="item.value" :value="item.scode" :disabled="item.status === 1">
              <span style="float: left; color: #8492a6; font-size: 13px">{{ item.scode }}</span>
              <span style="float: right">{{item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="重定向地址" prop="webServerRedirectUri">
            <el-input v-model="form.webServerRedirectUri" placeholder="客户端密钥重定向地址"></el-input>
        </el-form-item>
        <el-form-item label="资源信息" prop="resourceIds">
          <el-input v-model="form.resourceIds" placeholder="资源信息,用逗号分隔多条数据"></el-input>
        </el-form-item>
        <!--<el-form-item label="权限信息" prop="authorities">
            <el-input v-model="form.authorities" placeholder="权限信息,用逗号分隔多条数据"></el-input>
        </el-form-item>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="令牌期效" prop="accessTokenValidity">
              <el-input v-model="form.accessTokenValidity" placeholder="令牌期效,单位秒"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="刷新令牌期效" prop="refreshTokenValidity">
              <el-input v-model="form.refreshTokenValidity" placeholder="刷新令牌期效,单位秒"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="附加信息" prop="additionalInformation">
            <el-input v-model="form.additionalInformation" placeholder="附加信息"></el-input>
        </el-form-item>
        <el-form-item prop="autoapprove">
          <el-switch
                     v-model="form.autoapprove"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     active-text="自动授权"
                     inactive-text="手动授权"
                     active-value=true
                     inactive-value=false>
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round @click="cancel('form')" icon="el-icon-circle-close">{{$t('table.cancel')}}</el-button>
        <el-button round v-if="dialogStatus==='create'" type="primary" @click="create('form')" icon="el-icon-circle-check" autofocus>{{$t('table.confirm')}}</el-button>
        <el-button round v-else type="primary" @click="update('form')" icon="el-icon-circle-check" autofocus>{{$t('table.update')}}</el-button>
      </div>
    </el-dialog>
    <grantPermission ref="grantPermission" ></grantPermission>
  </div>
</template>
<script>
import { getClient, postClient, putClient, deleteClient, listClientPage } from './client.js'
import waves from '@/directive/waves/index.js' // 水波纹指令
import { listChildPermissions } from '../permission/permission'
import grantPermission from '../permission/grantPermission'

export default {
  name: 'development_authClient',
  directives: {
    waves
  },
  components: {
    grantPermission
  },
  data() {
    return {
      list: null,
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
        clientId: [
          {
            required: true,
            message: '客户端标识是唯一标识，不能为空，不能重复',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 48,
            message: '长度在 1 到 48 个字符',
            trigger: 'blur'
          }
        ],
        scope: [
          {
            required: true,
            message: '作用域不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 256,
            message: '长度在 1 到 256 个字符',
            trigger: 'blur'
          }
        ],
        clientSecret: [
          {
            required: true,
            message: '密钥不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 256,
            message: '长度在 1 到 256 个字符',
            trigger: 'blur'
          }
        ],
        authorizedGrantTypeArray: [
          {
            type: 'array',
            required: true,
            message: '授权类型至少选择一个',
            trigger: 'change'
          }
        ]
      },
      grantTypesOptions: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      }
    }
  },
  created() {
    this.asyncLoadDictionaryByCode(7, (data) => {
      this.grantTypesOptions = data
    })
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
    handlePermission(row) {
      const checkKeys = []
      const authorities = row && row.authorities ? row.authorities.split(',') : []
      for (let i = 0; i < authorities.length; i++) {
        const key = parseInt(authorities[i])
        if (key && key > -1) {
          const permission = {
            permissionId: key
          }
          checkKeys.push(permission)
        }
      }
      this.form = row
      const data = {
        id: this.form.clientId,
        name: this.form.clientId
      }
      this.$refs.grantPermission.initData(this, data, checkKeys, '133')
    },
    updatePermession(id, unionPermissions) {
      return new Promise((resolve, reject) => {
        this.form.authorities = unionPermissions.join(',')
        putClient(this.form).then(() => {
          this.dialogPermissionVisible = false
          resolve(true)
        }).catch(reason => {
          reject(reason)
        })
      })
    },
    listChildPermissions(pId) {
      return new Promise((resolve, reject) => {
        listChildPermissions(pId).then((response) => {
          resolve(response)
        }).catch(reason => {
          reject(reason)
        })
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getList() {
      this.listLoading = true
      listClientPage(this.pageModule).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      }).catch(reason => {
        this.$notify({
          title: '获取客户端列表失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    handleSearch() {
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
      if (!this.form || !this.form.clientId) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      getClient(this.form.clientId).then(response => {
        this.form = response.data
        this.form.authorizedGrantTypeArray = this.form.authorizedGrantTypes.split(',')
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      }).catch(reason => {
        this.$notify({
          title: '获取客户端失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    handleDelete() {
      if (!this.form || !this.form.clientId) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      this.$confirm(
        '此操作将永久删除客户端名( ' + this.form.clientId + ' )的相关数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteClient(this.form.clientId).then(response => {
          this.dialogFormVisible = false
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除客户端成功!',
            type: 'success',
            duration: 2000
          })
        }).catch(reason => {
          this.$notify({
            title: '删除客户端失败',
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
          this.form.authorizedGrantTypes = this.form.authorizedGrantTypeArray.join(',')
          postClient(this.form).then(() => {
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
              title: '新建客户端失败',
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
      this.dialogPermissionVisible = false
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
          this.form.authorizedGrantTypes = this.form.authorizedGrantTypeArray.join(',')
          putClient(this.form).then(() => {
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
              title: '更新客户端信息失败',
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
        clientId: undefined,
        clientSecret: undefined,
        authorizedGrantTypes: undefined,
        authorizedGrantTypeArray: [],
        scope: undefined,
        resourceIds: undefined,
        webServerRedirectUri: undefined,
        authorities: undefined,
        accessTokenValidity: undefined,
        refreshTokenValidity: undefined,
        additionalInformation: undefined,
        autoapprove: false
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

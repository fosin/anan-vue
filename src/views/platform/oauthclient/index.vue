<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input
        v-model="pageModule.params.clientId"
        :placeholder="$t('oauth_client_details.searchText')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleSearch()"
      />
      <el-button-group>
        <el-button v-waves round class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch()">
          {{ $t('table.search') }}
        </el-button>
        <el-button v-waves v-permission="'50'" round class="filter-item" style="margin-left: 5px;" type="primary" icon="el-icon-circle-plus" @click="handleAdd()">
          {{ $t('table.add') }}
        </el-button>
      </el-button-group>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="努力加载中"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
      @row-click="rowClick"
    >
      <el-table-column :label="$t('oauth_client_details.clientId.label')" align="center" sortable prop="clientId" />

      <!--  <el-table-column align="center" :label="$t('oauth_client_details.clientSecret.label')" sortable prop="clientSecret"></el-table-column>
          <el-table-column align="center" :label="$t('oauth_client_details.webServerRedirectUri.label')" sortable prop="webServerRedirectUri" width="250px"></el-table-column>

-->
      <el-table-column :label="$t('oauth_client_details.scope.label')" align="center" sortable prop="scope" />

      <el-table-column :label="$t('oauth_client_details.authorizedGrantTypes.label')" align="center" sortable prop="authorizedGrantTypes" width="250px" />

      <el-table-column :label="$t('oauth_client_details.accessTokenValidity.label')" align="center" sortable prop="accessTokenValidity" />
      <el-table-column :label="$t('oauth_client_details.refreshTokenValidity.label')" align="center" sortable prop="refreshTokenValidity" />
      <!--
      <el-table-column align="center" class-name="status-col" :label="$t('oauth_client_details.resourceIds.label')" sortable prop="resourceIds">
      </el-table-column>
      <el-table-column align="center" class-name="status-col" :label="$t('oauth_client_details.authorities.label')" sortable prop="authorities">
      </el-table-column>
     <el-table-column align="center" class-name="status-col" :label="$t('oauth_client_details.additionalInformation.label')" sortable prop="additionalInformation">
      </el-table-column>-->
      <el-table-column :label="$t('oauth_client_details.autoapprove.label')" align="center" sortable prop="autoapprove" />
      <el-table-column :label="$t('table.actions')" align="center" width="280">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-waves
              v-permission="'51'"
              round
              size="mini"
              type="success"
              class="filter-item"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >
              {{ $t('table.edit') }}
            </el-button>
            <el-button
              v-waves
              v-permission="'133'"
              round
              size="mini"
              type="warning"
              style="margin-left: 5px;"
              icon="el-icon-menu"
              @click="handlePermission(scope.row)"
            >
              {{ $t('table.permission') }}
            </el-button>
            <el-button
              v-waves
              v-permission="'52'"
              round
              size="mini"
              type="danger"
              class="filter-item"
              style="margin-left: 5px;"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >
              {{ $t('table.delete') }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="pageModule.pageNumber" :page-sizes="pageSizes" :page-size="pageModule.pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="dialogStatus === 'create'" :label="$t('oauth_client_details.clientId.label')" prop="clientId">
              <el-input v-model="form.clientId" :placeholder="$t('oauth_client_details.clientId.placeholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('oauth_client_details.scope.label')" prop="scope">
              <el-input v-model="form.scope" :placeholder="$t('oauth_client_details.scope.placeholder')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('oauth_client_details.clientSecret.label')" prop="clientSecret">
          <el-input v-model="form.clientSecret" :placeholder="$t('oauth_client_details.clientSecret.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('oauth_client_details.authorizedGrantTypes.label')" prop="authorizedGrantTypeArray">
          <el-select v-model="form.authorizedGrantTypeArray" :placeholder="$t('oauth_client_details.authorizedGrantTypes.placeholder')" filterable multiple>
            <el-option
              v-for="item in grantTypesOptions"
              :key="item.scode"
              :label="item.value"
              :value="item.scode"
              :disabled="item.status === 1"
            >
              <span style="float: left; color: #8492a6; font-size: 13px">{{ item.scode }}</span>
              <span style="float: right">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('oauth_client_details.webServerRedirectUri.label')" prop="webServerRedirectUri">
          <el-input v-model="form.webServerRedirectUri" :placeholder="$t('oauth_client_details.webServerRedirectUri.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('oauth_client_details.resourceIds.label')" prop="resourceIds">
          <el-input v-model="form.resourceIds" :placeholder="$t('oauth_client_details.resourceIds.placeholder')" />
        </el-form-item>
        <!--<el-form-item :label="$t('oauth_client_details.authorities.label')" prop="authorities">
            <el-input v-model="form.authorities" :placeholder="$t('oauth_client_details.authorities.placeholder')"></el-input>
        </el-form-item>-->
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('oauth_client_details.accessTokenValidity.label')" prop="accessTokenValidity">
              <el-input v-model="form.accessTokenValidity" :placeholder="$t('oauth_client_details.accessTokenValidity.placeholder')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('oauth_client_details.refreshTokenValidity.label')" prop="refreshTokenValidity">
              <el-input v-model="form.refreshTokenValidity" :placeholder="$t('oauth_client_details.refreshTokenValidity.placeholder')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('oauth_client_details.additionalInformation.label')" prop="additionalInformation">
          <el-input v-model="form.additionalInformation" :placeholder="$t('oauth_client_details.additionalInformation.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('oauth_client_details.autoapprove.label')" prop="autoapprove">
          <el-switch
            v-model="form.autoapprove"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="true"
            inactive-value="false"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round icon="el-icon-circle-close" @click="cancel('form')">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button v-if="dialogStatus==='create'" round type="primary" icon="el-icon-circle-check" autofocus @click="create('form')">
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
import { getClient, postClient, putClient, deleteClient, listClientPage } from './oauthclient.js'

import { listChildPermissions } from '../permission/permission'
import grantPermission from '../permission/grantPermission'

export default {
  name: 'DevelopmentAuthClient',
  components: {
    grantPermission
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: false,
      pageModule: {
        pageNumber: 1,
        pageSize: 10,
        params: {
          clientId: '',
          additionalInformation: '',
          queryRule: {
            logiOperator: 'or',
            relaRules: [
              {
                fieldName: 'clientId',
                relaOperator: 'like'
              },
              {
                fieldName: 'additionalInformation',
                relaOperator: 'like'
              }
            ]
          },
          sortRules: [{
            sortName: 'clientId',
            sortOrder: 'ASC' }
          ]
        }
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
  mounted() {
    this.loadDictionaryById(7).then(res => {
      this.grantTypesOptions = res.details
    })
    this.loadOrganizParameterValue('DefaultPageSize', '10', '表格默认每页记录数').then(res => {
      this.pageModule.pageSize = parseInt(res)
    })
    this.loadOrganizParameterValue('DefaultPageSizes', '5,10,25,50,100', '表格默认每页记录数可选择项').then(res => {
      const temp = res.split(',')
      this.pageSizes = []
      for (let i = 0; i < temp.length; i++) {
        this.pageSizes[i] = parseInt(temp[i])
      }
    })
    this.getList()
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
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getList() {
      this.listLoading = true
      this.pageModule.params.additionalInformation = this.pageModule.params.clientId
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
    handleEdit(row) {
      getClient(row.clientId).then(response => {
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
    handleDelete(row) {
      this.$confirm(
        '此操作将永久删除客户端名( ' + row.clientId + ' )的相关数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteClient(row.clientId).then(response => {
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
      })
    },
    create(formName) {
      const refs = this.$refs
      refs[formName].validate(valid => {
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
      const sortRule = {
        sortOrder: (column.order && column.order === 'descending') ? 'DESC' : 'ASC',
        sortName: column.prop
      }
      this.pageModule.params.sortRules = []
      this.pageModule.params.sortRules.push(sortRule)
      if (column.prop) {
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

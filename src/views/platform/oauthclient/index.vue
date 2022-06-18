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
        <el-table-column :label="$t('table.actions')" align="center" width="120px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="$t('table.edit')" placement="top">
              <el-button
                v-waves
                v-permission="'51'"
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
                v-waves
                v-permission="'133'"
                round
                size="mini"
                type="warning"
                style="margin-left: 5px;"
                icon="el-icon-menu"
                @click="handlePermission(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </data-table>
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
import DataTable from '@/components/DataTable'
import grantPermission from '../permission/grantPermission'
import { listChildPermissions } from '../permission/permission'
import { getClient, postClient, putClient } from './oauthclient.js'

export default {
  name: 'DevelopmentAuthClient',
  components: {
    grantPermission,
    DataTable
  },
  data() {
    return {
      listQuery: {
        listUrl: 'gateway/platform/v1/oauthclient/paging',
        pageSizes: [5, 10, 25, 50, 100],
        search: {
          input: null,
          cols: ['clientId', 'code'],
          placeholder: this.$t('oauth_client_details.searchText')
        },
        pageModule: {
          pageNumber: 1,
          pageSize: 10,
          params: {
            clientId: null,
            additionalInformation: null,
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
            url: 'gateway/platform/v1/oauthclient/ids',
            method: 'delete',
            permissionId: '52',
            confirm: true
          }
        ],
        addAction: {
          enable: true,
          route: '',
          permissionId: '50'
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
      this.listQuery.pageModule.pageSize = parseInt(res)
    })
    this.loadOrganizParameterValue('DefaultPageSizes', '5,10,25,50,100', '表格默认每页记录数可选择项').then(res => {
      const temp = res.split(',')
      this.pageSizes = []
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
    handleAdd() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      getClient(row.clientId).then(response => {
        this.form = response.data.data
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
    create(formName) {
      const refs = this.$refs
      refs[formName].validate(valid => {
        if (valid) {
          this.form.authorizedGrantTypes = this.form.authorizedGrantTypeArray.join(',')
          postClient(this.form).then(() => {
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
            this.$refs.pagingTable.getList()
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
    }
  }
}
</script>

<style scoped>
  .el-select {
    width: 100%;
  }
</style>

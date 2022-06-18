<template>
  <div class="app-container calendar-list-container">
    <data-table
      ref="pagingTable"
      :options="options"
      :list-query="listQuery"
      style="width: 100%"
      @handle-add="handleAdd()"
    >
      <template slot="filter-content">
        <el-button
          v-waves
          v-permission="'57'"
          round
          type="warning"
          class="filter-item"
          style="margin-left: 5px;"
          icon="el-icon-upload"
          @click="handleApplys()"
        >
          {{ $t('table.applys') }}
        </el-button>
      </template>
      <template slot="data-columns">
        <el-table-column
          :label="$t('anan_parameter.name.label')"
          fixed
          align="center"
          sortable
          prop="name"
          width="200px"
        />
        <el-table-column :label="$t('anan_parameter.value.label')" align="center" sortable prop="value" width="120px" />
        <el-table-column
          :label="$t('anan_parameter.description.label')"
          align="center"
          sortable
          prop="description"
          width="620px"
        />
        <el-table-column :label="$t('anan_parameter.type.label')" align="center" sortable prop="type" width="120px">
          <template slot-scope="scope">
            <span>{{ getTypeName(scope.row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('anan_parameter.scope.label')" align="center" sortable prop="scope" width="100px">
          <template slot-scope="scope">
            <span>{{ getScopeName(scope.row.type, scope.row.scope) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('anan_parameter.applyTime.label')"
          align="center"
          sortable
          prop="applyTime"
          width="160px"
        />
        <el-table-column :label="$t('anan_parameter.applyBy.label')" align="center" sortable prop="applyBy" width="100px">
          <template slot-scope="scope">
            <span>{{ getDicValue(organizTopUsers,"id",scope.row.applyBy,"username") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.updateTime.label')"
          align="center"
          sortable
          prop="updateTime"
          width="160px"
        />
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
        <el-table-column fixed="right" :label="$t('table.actions')" align="center" width="120px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="$t('table.edit')" placement="top">
              <el-button
                v-waves
                v-permission="'54'"
                round
                size="mini"
                type="success"
                class="filter-item"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
              />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('table.apply')" placement="top">
              <el-button
                v-waves
                v-permission="'56'"
                round
                size="mini"
                type="warning"
                class="filter-item"
                style="margin-left: 5px;"
                icon="el-icon-upload"
                @click="handleApply(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </data-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item :label="$t('anan_parameter.name.label')" prop="name">
          <el-input v-model="form.name" :placeholder="$t('anan_parameter.name.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_parameter.value.label')" prop="value">
          <el-input v-model="form.value" type="textarea" :placeholder="$t('anan_parameter.value.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_parameter.defaultValue.label')" prop="defaultValue">
          <el-input v-model="form.defaultValue" type="textarea" :placeholder="$t('anan_parameter.defaultValue.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_parameter.description.label')" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :placeholder="$t('anan_parameter.description.placeholder')"
          />
        </el-form-item>
        <el-form-item :label="$t('anan_parameter.type.label')" prop="type">
          <el-select
            v-model="form.type"
            :placeholder="$t('anan_parameter.type.placeholder')"
            :disabled="dialogStatus!=='create'"
            class="filter-item"
            @change="typeChange"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.name"
              :label="item.value"
              :value="item.name"
              :disabled="item.status === 1"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.type ===1 || form.type === 2 || form.type === 3"
          :label="$t('anan_parameter.scope.label')"
          prop="scope"
        >
          <el-select
            v-model="form.scope"
            clearable
            :placeholder="$t('anan_parameter.scope.placeholder')"
            class="filter-item"
          >
            <el-option
              v-for="item in scopeOptions"
              :key="item.name"
              :label="item.value"
              :value="item.name"
            >
              <span style="float: left; color: #8492a6; font-size: 13px">{{ item.code }}</span>
              <span style="float: right">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="dialogStatus==='create'"
          v-waves
          round
          type="primary"
          icon="el-icon-circle-check"
          @click="create('form')"
        >
          {{ $t('table.confirm') }}
        </el-button>
        <el-button v-else v-waves round type="primary" icon="el-icon-circle-check" @click="update('form')">
          {{ $t('table.update') }}
        </el-button>
        <el-button v-waves round autofocus icon="el-icon-circle-close" @click="cancel('form')">
          {{ $t('table.cancel') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import { listService } from '@/views/platform/service/service'
import { mapGetters } from 'vuex'
import { listOrganizAllChild } from '../organization/organization'
import { listUserByTopId } from '../user/user'
import { applyParameter, applysParameter, getParameter, postParameter, putParameter } from './parameter'

export default {
  name: 'ConfigParameter',
  components: { DataTable },
  data() {
    return {
      listQuery: {
        listUrl: 'gateway/platform/v1/parameter/paging',
        pageSizes: [5, 10, 25, 50, 100],
        search: {
          input: null,
          cols: ['name', 'value', 'defaultValue', 'description'],
          placeholder: this.$t('anan_parameter.searchText')
        },
        pageModule: {
          pageNumber: 1,
          pageSize: 10,
          params: {
            name: null,
            value: null,
            defaultValue: null,
            description: null,
            queryRule: {
              logiOperator: 'or',
              relaRules: [
                {
                  fieldName: 'description',
                  relaOperator: 'like'
                },
                {
                  fieldName: 'name',
                  relaOperator: 'like'
                },
                {
                  fieldName: 'defaultValue',
                  relaOperator: 'like'
                },
                {
                  fieldName: 'value',
                  relaOperator: 'like'
                }
              ]
            },
            sortRules: [
              {
                sortName: 'name',
                sortOrder: 'ASC'
              }
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
            url: 'gateway/platform/v1/parameter/ids',
            method: 'delete',
            permissionId: '55',
            confirm: true,
            successMsg: '使用【发布】功能才能生效!'
          },
          {
            value: 'cancelDelete',
            label: this.$t('table.cancel') + this.$t('table.delete'),
            url: 'gateway/platform/v1/parameter/cancelDelete/ids',
            method: 'post',
            permissionId: '55',
            confirm: false
          },
          {
            value: 'applys',
            label: this.$t('table.apply'),
            url: 'gateway/platform/v1/parameter/applys/ids',
            method: 'post',
            permissionId: '57',
            confirm: false
          }
        ],
        addAction: {
          enable: true,
          route: '',
          permissionId: '53'
        },
        tableRowClass: {
          column: 'status',
          data: [
            {
              key: 1,
              value: 'warning-row'
            },
            {
              key: 2,
              value: 'danger-row'
            }
          ]
        }
      },
      form: {},
      rules: {
        name: [
          {
            required: true,
            message: '参数键不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 64,
            message: '长度在 1 到 64 个字符',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '参数类型不能为空',
            trigger: 'blur'
          }
        ]
      },
      typeOptions: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      typeScopeOptions: {},
      scopeOptions: [],
      oraganizOptions: [],
      organizTopUsers: []
    }
  },
  computed: {
    ...mapGetters(['ananUserInfo'])
  },
  created() {
    this.loadDictionaryById(10).then(res => {
      this.typeOptions = res.details
    })
    listUserByTopId().then(response => {
      this.organizTopUsers = response.data.data
      const scopeOptions = []
      for (let i = 0; i < this.organizTopUsers.length; i++) {
        const user = this.organizTopUsers[i]
        const scope = {
          name: user.id + '',
          code: user.usercode,
          value: user.username
        }
        scopeOptions.push(scope)
      }
      this.typeScopeOptions[2] = scopeOptions
    }).catch(reason => {
      this.$notify({
        title: '获取所有用户失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
    this.listOrganizAllChild(this.ananUserInfo.organizId)
    this.getServiceScopes()
  },
  methods: {
    typeChange(type) {
      let scopeOptions = this.typeScopeOptions[type]
      if (!scopeOptions) {
        scopeOptions = []
        this.typeScopeOptions[type] = []
      }
      this.scopeOptions = scopeOptions
    },
    getServiceScopes() {
      listService().then(response => {
        this.ServiceOptions = response.data.data
        const scopeOptions = []
        for (let i = 0; i < this.ServiceOptions.length; i++) {
          const service = this.ServiceOptions[i]
          const scope = {
            name: service.id + '',
            code: service.code,
            value: service.name
          }
          scopeOptions.push(scope)
        }
        this.typeScopeOptions[3] = scopeOptions
      }).catch(reason => {
        this.$notify({
          title: '获取所有服务失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    listOrganizAllChild(organizId) {
      listOrganizAllChild(organizId).then(response => {
        this.oraganizOptions = response.data.data || []
        const scopeOptions = []
        for (let i = 0; i < this.oraganizOptions.length; i++) {
          const organiz = this.oraganizOptions[i]
          const scope = {
            name: organiz.id + '',
            code: organiz.code,
            value: organiz.name
          }
          scopeOptions.push(scope)
        }
        this.typeScopeOptions[1] = scopeOptions
      }).catch(reason => {
        this.$notify({
          title: '查询后代机构信息失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    getTypeName(type) {
      const typeOption = this.typeOptions.filter(value => {
        return value.name === type
      })
      return typeOption.length > 0 ? typeOption[0].value : type
    },
    getScopeName(type, scope) {
      const scopeOptions = this.typeScopeOptions[type]
      if (scopeOptions === undefined || scopeOptions === [] || scopeOptions === {}) {
        return scope
      }
      const scopeOption = scopeOptions.filter(value => {
        return value.name === scope
      })
      return scopeOption && scopeOption.length && scopeOption.length > 0 ? scopeOption[0].value : scope
    },
    handleAdd() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      getParameter(row.id).then(response => {
        this.form = response.data.data
        this.scopeOptions = this.typeScopeOptions[this.form.type]
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      }).catch(reason => {
        this.$notify({
          title: '获取参数失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    handleApply(row) {
      this.$confirm(
        '此操作将刷新参数名( ' + row.name + ' )的缓存数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        applyParameter(row.id).then(() => {
          this.$refs.pagingTable.getList()
          this.$notify({
            title: '成功',
            message: '发布参数成功!',
            type: 'success',
            duration: 2000
          })
        }).catch(reason => {
          this.$notify({
            title: '发布参数失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      }).catch(() => {
      })
    },
    handleApplys() {
      this.$confirm(
        '此操作将刷新所有更改过参数的缓存数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        applysParameter().then(() => {
          this.$refs.pagingTable.getList()
          this.$notify({
            title: '成功',
            message: '发布参数成功!',
            type: 'success',
            duration: 2000
          })
        }).catch(reason => {
          this.$notify({
            title: '发布参数失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      }).catch(() => {
      })
    },
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          postParameter(this.form).then(() => {
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
              title: '新建参数失败',
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.form.status = 1
          putParameter(this.form).then(() => {
            this.dialogFormVisible = false
            this.$refs.pagingTable.getList()
            this.$notify({
              title: '修改成功',
              message: '若要立即生效则需要使用【发布】功能!',
              type: 'success',
              duration: 5000
            })
          }).catch(reason => {
            this.$notify({
              title: '更新参数信息失败',
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
        defaultValue: undefined,
        type: undefined,
        scope: '',
        status: 0
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

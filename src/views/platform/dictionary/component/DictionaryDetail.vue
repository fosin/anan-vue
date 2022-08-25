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
        <el-table-column
          :label="$t('anan_dictionary_detail.name.label')"
          align="center"
          sortable
          prop="name"
          width="120px"
        />
        <el-table-column
          :label="$t('anan_dictionary_detail.value.label')"
          align="center"
          sortable
          prop="value"
          width="150px"
        />
        <el-table-column
          :label="$t('anan_dictionary_detail.sort.label')"
          align="center"
          sortable
          prop="sort"
          width="80px"
        />
        <el-table-column
          :label="$t('anan_dictionary_detail.status.label')"
          align="center"
          sortable
          prop="status"
          width="90px"
        >
          <template slot-scope="scope">
            <span>{{ getStatusValue(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('anan_dictionary_detail.scope.label')"
          align="center"
          sortable
          prop="scope"
          width="120px"
        />
        <el-table-column
          :label="$t('anan_dictionary_detail.scode.label')"
          align="center"
          sortable
          prop="scode"
          width="120px"
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
        <el-table-column :label="$t('table.updateTime.label')" width="160px" align="center" sortable prop="updateTime" />
        <el-table-column :label="$t('table.actions')" align="center" width="80px" fixed="right">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="$t('table.edit')" placement="top">
              <el-button
                v-waves
                v-permission="'63'"
                round
                size="mini"
                type="success"
                class="filter-item"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </data-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('anan_dictionary.name.label')">
          <el-input v-model="selectedDictionary.name" :disabled="true" />
        </el-form-item>
        <el-form-item :label="$t('anan_dictionary_detail.name.label')" prop="name">
          <el-input v-model="form.name" :placeholder="$t('anan_dictionary_detail.name.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_dictionary_detail.value.label')" prop="value">
          <el-input v-model="form.value" :placeholder="$t('anan_dictionary_detail.value.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_dictionary_detail.sort.label')" prop="sort">
          <el-input v-model="form.sort" :placeholder="$t('anan_dictionary_detail.sort.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_dictionary_detail.scode.label')" prop="scode">
          <el-input v-model="form.scode" :placeholder="$t('anan_dictionary_detail.scode.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_dictionary_detail.scope.label')" prop="scope">
          <el-input v-model="form.scope" :placeholder="$t('anan_dictionary_detail.scope.placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('anan_dictionary_detail.status.label')" prop="status">
          <el-switch
            v-model="form.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="0"
            inactive-value="1"
          />
        </el-form-item>
        <el-form-item :label="$t('anan_dictionary_detail.description.label')" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
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
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import { getDictionaryDetail, postDictionaryDetail, putDictionaryDetail } from '@/utils/dic'
import { listUserByTopId } from '@/views/platform/user/user'

export default {
  name: 'DictionaryDetail',
  components: {
    DataTable
  },
  data() {
    return {
      selectedDictionary: {},
      organizTopUsers: [],
      DefaultDictionaryDetailNameAndSort: 1,
      listQuery: {
        listUrl: 'gateway/platform/api/dictionarydetail/paging',
        pageSizes: [5, 10, 25, 50, 100],
        search: {
          colSpan: 12,
          input: null,
          cols: ['value'],
          placeholder: this.$t('anan_dictionary_detail.searchText')
        },
        pageModule: {
          pageNumber: 1,
          pageSize: 10,
          params: {
            dictionaryId: 0,
            value: null,
            queryRule: {
              relaRules: [
                {
                  fieldName: 'value',
                  relaOperator: 'like'
                },
                {
                  fieldName: 'dictionaryId',
                  relaOperator: 'eq'
                }
              ]
            },
            sortRules: [{
              sortName: 'name',
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
            url: 'gateway/platform/api/dictionarydetail/ids',
            method: 'delete',
            permissionId: '64',
            confirm: true
          },
          {
            value: 'disable',
            label: this.$t('table.disable'),
            url: 'gateway/platform/api/dictionarydetail/field/status/1',
            method: 'post',
            permissionId: '63',
            confirm: false
          },
          {
            value: 'enable',
            label: this.$t('table.enable'),
            url: 'gateway/platform/api/dictionarydetail/field/status/0',
            method: 'post',
            permissionId: '63',
            confirm: false
          }
        ],
        addAction: {
          enable: true,
          route: '',
          permissionId: '62'
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
        sort: [
          {
            required: true,
            message: '字典明细项顺序不能为空',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '字典明细项键不能为空',
            trigger: 'blur'
          }
        ]
      },
      statusOptions: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      }
    }
  },
  created() {
    this.loadDictionaryById(11).then(res => {
      this.statusOptions = res.details
    })
    this.loadOrganizParameterValue('DefaultDictionaryDetailNameAndSort', '1', '新增字典明细时是否按当前数据总量自动生成字典key和字典Sort，0=不自动 1=自动，默认为自动').then(res => {
      this.DefaultDictionaryDetailNameAndSort = res
    })
    listUserByTopId().then(response => {
      this.organizTopUsers = response.data.data
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
    getList(row) {
      if (row && row.id) {
        this.listQuery.pageModule.params.dictionaryId = row.id
        this.$refs.pagingTable.getList()
      }
    },
    getStatusValue(status) {
      if (this.statusOptions && this.statusOptions.length > 0) {
        const statusOption = this.statusOptions.filter(value => {
          return value.name === status
        })
        return statusOption.length > 0 ? statusOption[0].value : status
      }
      return status
    },
    handleAdd() {
      if (!this.selectedDictionary || !this.selectedDictionary.id) {
        this.$message({
          message: '操作前请先选择一个字典明细项!'
        })
        return
      }
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleEdit(row) {
      getDictionaryDetail(row.id).then(response => {
        this.form = response.data.data
        this.form.status = this.form.status + ''
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      }).catch(reason => {
        this.$notify({
          title: '获取字典明细项失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          postDictionaryDetail(this.form).then(() => {
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
              title: '新建字典明细项失败',
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
          putDictionaryDetail(this.form).then(() => {
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
              title: '更新字典明细项信息失败',
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
      const sort = this.$refs.pagingTable.dataList.total + 1
      this.form = {
        id: undefined,
        name: this.DefaultDictionaryDetailNameAndSort === 1 ? sort : undefined,
        value: undefined,
        scode: undefined,
        scope: undefined,
        sort: this.DefaultDictionaryDetailNameAndSort === 1 ? sort : undefined,
        status: '0',
        dictionaryId: this.selectedDictionary.id,
        used: 0
      }
    }
  }
}
</script>

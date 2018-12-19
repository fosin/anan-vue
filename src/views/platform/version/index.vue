<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleSearch" style="width: 200px;" class="filter-item" :placeholder="$t('cdp_sys_version.searchText')"
                v-model="pageModule.searchText">
      </el-input>
      <el-button-group>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch" round v-waves>
        {{$t('table.search')}}
      </el-button>
      <el-button v-permission="'112'" class="filter-item" style="margin-left: 5px;" @click="handleAdd" type="primary"
                 icon="el-icon-circle-plus" round v-waves>{{$t('table.add')}}
      </el-button>
      <el-button type="success" v-permission="'113'" class="filter-item" style="margin-left: 5px;" icon="el-icon-edit"
                 @click="handleEdit()" round v-waves>{{$t('table.edit')}}
      </el-button>
      <el-button type="danger" v-permission="'114'" class="filter-item" style="margin-left: 5px;" icon="el-icon-delete"
                 @click="handleDelete()" round v-waves>{{$t('table.delete')}}
      </el-button>
      </el-button-group>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="努力加载中"
              border fit highlight-current-row style="width: 100%" :default-sort="{prop: 'name', order: 'ascending'}"
              @sort-change="sortChange" @row-click="rowClick">
      <el-table-column align="center" :label="$t('cdp_sys_version.name.label')" sortable prop="name"></el-table-column>
      <el-table-column align="center" :label="$t('cdp_sys_version.type.label')" sortable prop="type">
        <template slot-scope="scope">
          <el-tag>{{getDicNameValue(typeOptions,scope.row.type)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('cdp_sys_version.price.label')" sortable prop="price"></el-table-column>
      <el-table-column align="center" :label="$t('cdp_sys_version.validity.label')" sortable prop="validity"></el-table-column>
      <el-table-column align="center" :label="$t('cdp_sys_version.tryoutDays.label')" sortable prop="tryoutDays"></el-table-column>
      <el-table-column align="center" :label="$t('cdp_sys_version.protectDays.label')" sortable prop="protectDays"></el-table-column>
      <el-table-column align="center" :label="$t('cdp_sys_version.maxOrganizs.label')" sortable prop="maxOrganizs" width="140px"></el-table-column>
      <el-table-column align="center" :label="$t('cdp_sys_version.maxUsers.label')" sortable prop="maxUsers" width="120px"></el-table-column>
      <!--<el-table-column align="center" :label="$t('cdp_sys_version.beginTime.label')" sortable prop="beginTime" width="160"></el-table-column>
      <el-table-column align="center" :label="$t('cdp_sys_version.endTime.label')" sortable prop="endTime" width="160"></el-table-column>-->
      <el-table-column align="center" :label="$t('cdp_sys_version.status.label')" sortable prop="status">
        <template slot-scope="scope">
          <el-tag>{{getDicNameValue(statusOptions,scope.row.status)}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.permission')" width="100">
        <template slot-scope="scope">
          <el-button round size="mini" type="warning" @click="handlePermission(scope.row)">{{$t('table.permission')}}</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageModule.pageNumber" :page-sizes="pageSizes" :page-size="pageModule.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="700px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('cdp_sys_version.name.label')" prop="name">
              <el-input v-model="form.name" :placeholder="$t('cdp_sys_version.name.placeholder')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('cdp_sys_version.type.label')" prop="type">
              <el-select class="filter-item" v-model="form.type" :placeholder="$t('cdp_sys_version.type.placeholder')">
                <el-option v-for="item in typeOptions" :key="item.name" :label="item.value" :value="item.name"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('cdp_sys_version.price.label')" prop="price">
              <el-input v-model.number="form.price" :placeholder="$t('cdp_sys_version.price.placeholder')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('cdp_sys_version.validity.label')" prop="validity">
              <el-input v-model.number="form.validity" :placeholder="$t('cdp_sys_version.validity.placeholder')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('cdp_sys_version.protectDays.label')" prop="protectDays">
              <el-input v-model.number="form.protectDays" :placeholder="$t('cdp_sys_version.protectDays.placeholder')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('cdp_sys_version.beginTime.label')" prop="beginTime" label-width="120px">
              <el-date-picker
                v-model="form.beginTime"
                align="right"
                type="date"
                style="width: 100%;"
                :placeholder="$t('cdp_sys_version.beginTime.placeholder')"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('cdp_sys_version.endTime.label')" prop="endTime" label-width="120px">
              <el-date-picker
                v-model="form.endTime"
                align="right"
                type="date"
                style="width: 100%;"
                :placeholder="$t('cdp_sys_version.endTime.placeholder')"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('cdp_sys_version.status.label')" prop="status">
              <el-switch v-model="form.status"
                         active-color="#13ce66"
                         inactive-color="#ff4949"
                         active-value=0
                         inactive-value=1>
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="tryout">
              <el-checkbox v-model="tryout" >{{$t('cdp_sys_version.tryout.label')}}</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="tryout" :label="$t('cdp_sys_version.tryoutDays.label')" prop="tryoutDays">
              <el-input v-model.number="form.tryoutDays" :placeholder="$t('cdp_sys_version.tryoutDays.placeholder')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('cdp_sys_version.description.label')" prop="description">
          <el-input type="textarea" v-model="form.description" :placeholder="$t('cdp_sys_version.description.placeholder')" :autosize="{ minRows: 4, maxRows: 20}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')" icon="el-icon-circle-close">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="create('form')" icon="el-icon-circle-check"
                   autofocus>{{$t('table.confirm')}}
        </el-button>
        <el-button v-else type="primary" @click="update('form')" icon="el-icon-circle-check" autofocus>
          {{$t('table.update')}}
        </el-button>
      </div>
    </el-dialog>
    <grantPermission ref="grantPermission" ></grantPermission>
  </div>
</template>
<script>
  import { getVersion, postVersion, putVersion, deleteVersion, listVersionPage, listVersionPermissions, putVersionPermissions } from './version'
  import { listChildPermissions } from '../permission/permission'

  import { formatDate } from '@/utils/date'
  import grantPermission from '../permission/grantPermission'
  export default {
    name: 'development_version',

    components: {
      grantPermission
    },
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        tryout: false,
        pageModule: {
          pageNumber: 1,
          pageSize: 10,
          searchText: '',
          sortName: '',
          sortOrder: ''
        },
        pageSizes: [],
        typeOptions: [{ 'name': 0, 'value': '收费版' }, { 'name': 1, 'value': '免费版' }, { 'name': 2, 'value': '开发版' }],
        statusOptions: [{ 'name': 0, 'value': '启用' }, { 'name': 1, 'value': '禁用' }],
        form: {},
        rules: {
          name: [
            {
              required: true,
              message: '版本名称不能为空',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 64,
              message: '长度在 1 到 30 个字符',
              trigger: 'blur'
            }
          ],
          maxOrganizs: [
            {
              required: true,
              message: '可创建机构数不能为空'
            },
            {
              min: 1,
              type: 'number',
              message: '不能小于1'
            }
          ],
          maxUsers: [
            {
              required: true,
              message: '可创建用户数不能为空'
            },
            {
              min: 1,
              type: 'number',
              message: '不能小于1'
            }
          ],
          protectDays: [
            {
              required: true,
              message: '保护期不能为空'
            },
            {
              min: 0,
              type: 'number',
              message: '不能小于0'
            }
          ],
          tryoutDays: [
            {
              required: true,
              message: '试用期不能为空'
            },
            {
              type: 'number',
              min: 0,
              message: '不能小于0'
            }
          ],
          type: [
            {
              required: true,
              message: '请选择版本类型',
              trigger: 'change'
            }
          ],
          price: [
            {
              type: 'number',
              required: true,
              message: '请输入价格，不能为负数'
            }
          ],
          validity: [
            {
              required: true,
              message: '请输入有效期'
            },
            {
              min: 1,
              type: 'number',
              message: '不能小于1'
            }
          ],
          beginTime: [
            {
              required: true,
              message: '请选择开始日期',
              trigger: 'change'
            }
          ],
          endTime: [
            {
              required: true,
              message: '请选择结束日期',
              trigger: 'change'
            }
          ]
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        }
      }
    },
    mounted() {
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
    filters: {
      dateFormatFilter(date, pattern) {
        return formatDate(date, pattern || 'yyyy-MM-dd HH:mm:ss')
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        listVersionPage(this.pageModule).then(response => {
          this.list = response.data.rows
          this.total = response.data.total
          this.listLoading = false
        }).catch(reason => {
          this.$notify({
            title: '获取列表失败',
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
        if (!this.form || !this.form['id']) {
          this.$message({
            message: '操作前请先选择一条数据!'
          })
          return
        }
        getVersion(this.form['id']).then(response => {
          this.form = response.data
          this.form.status = this.form.status + ''
          this.tryout = this.form.tryout === 1
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        }).catch(reason => {
          this.$notify({
            title: '获取失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      },
      handleDelete() {
        if (!this.form || !this.form['id']) {
          this.$message({
            message: '操作前请先选择一条数据!'
          })
          return
        }
        this.$confirm(
          '此操作将永久删除相关数据, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          deleteVersion(this.form['id']).then(response => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功!',
              type: 'success',
              duration: 2000
            })
          }).catch(reason => {
            this.$notify({
              title: '删除失败',
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
            this.form.tryout = this.tryout ? 1 : 0
            postVersion(this.form).then(() => {
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
                title: '新建失败',
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
      handlePermission(row) {
        listVersionPermissions(row.id)
          .then(response => {
            this.form = row
            this.$refs.grantPermission.initData(this, this.form, response.data, '125')
          }).catch(reason => {
            this.$notify({
              title: '获取版本权限失败',
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
            versionId: id,
            permissionId: unionPermissions[i]
          }
          newRolePermissions.push(permission)
        }
        return new Promise((resolve, reject) => {
          putVersionPermissions(id, newRolePermissions).then(() => {
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
      cancel(formName) {
        this.dialogFormVisible = false
        if (formName === 'form') {
          this.$refs['form'].resetFields()
        }
      },
      update(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            this.form.tryout = this.tryout ? 1 : 0
            putVersion(this.form).then(() => {
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
                title: '更新信息失败',
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
          type: 0,
          name: undefined,
          price: 0.00,
          validity: 365,
          tryoutDays: 0,
          tryout: 0,
          protectDays: 0,
          maxOrganizs: 100,
          maxUsers: 300,
          status: '0'
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

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="multiShow && options.multiActions ? 3 : 0">
          <el-select
            v-show="multiShow && options.multiActions"
            v-model="multiNow"
            :placeholder="selectedLabel"
            style="margin-right: 5px"
            @change="handleAction"
          >
            <el-option
              v-for="item in options.multiActions"
              :key="item.value"
              v-permission="item.permissionId"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="multiShow && options.multiActions ? 21 : 24">
          <div>
            <el-row>
              <el-col :span="caclColSpan('search')">
                <el-input
                  v-if="listQuery.search.cols && listQuery.search.cols.length > 0"
                  v-model="listQuery.search.input"
                  :placeholder="listQuery.search.placeholder"
                  clearable
                  @keyup.enter.native="handleSearch()"
                />
              </el-col>
              <el-col :span="caclColSpan('')">
                <div>
                  <slot name="filter-content" />
                  <el-button
                    round
                    class="filter-item"
                    style="margin-left: 5px"
                    type="primary"
                    icon="el-icon-search"
                    @click="handleSearch()"
                  >
                    {{ $t('table.search') }}
                  </el-button>
                </div>
              </el-col>
              <el-col :span="caclColSpan('addButton')">
                <el-button
                  v-if="options.addAction.enable"
                  round
                  class="filter-item"
                  style="float: right"
                  type="primary"
                  icon="el-icon-circle-plus"
                  @click="handleAdd()"
                >{{ $t('table.add') }}
                </el-button>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList.data"
      border
      fit
      style="width: 100%"
      highlight-current-row
      :row-class-name="tableRowClassName"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
      @selection-change="handleSelection"
      @row-click="handleRowClick"
    >
      <el-table-column v-if="options.multi" align="center" type="selection" width="40" />
      <slot name="data-columns" />
    </el-table>
    <div v-show="!listLoading && dataList.total > 0" class="pagination-container">
      <el-pagination
        :current-page.sync="listQuery.pageModule.pageNumber"
        :page-sizes="listQuery.pageSizes"
        :page-size="listQuery.pageModule.pagesize"
        :total="dataList.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: 'PagingDataTable',
  // 组件入参
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          // 可批量操作
          multi: false,
          // 批量操作
          multiActions: [
            {
              value: '',
              label: '',
              url: '',
              method: 'post',
              // 0表示不控制权限
              permissionId: '0',
              // 操作前是否需要询问确认
              confirm: false,
              successMsg: '操作成功!',
              failureMsg: '操作失败!'
            }
          ],
          addAction: {
            enable: false,
            route: '',
            permissionId: ''
          },
          tableRowClass: {
            column: 'status',
            data: [
              {
                key: 998,
                value: 'info-row'
              },
              {
                key: 999,
                value: 'warning-row'
              },
              {
                key: 1000,
                value: 'danger-row'
              }
            ]
          }
        }
      }
    },
    // 列表查询参数
    listQuery: {
      type: Object,
      default: () => {
        return {
          // 列表请求URL
          listUrl: '/exam/api',
          pageSizes: [5, 10, 25, 50, 100],
          search: {
            colSpan: 5,
            placeholder: '输入查找内容后按回车进行查找',
            input: null,
            cols: []
          },
          pageModule: {
            t: null,
            pageNumber: 1,
            pageSize: 10,
            params: {
              queryRule: {
                logiOperator: 'and',
                relaRules: []
              },
              sortRules: [{
                sortName: '',
                sortOrder: 'ASC'
              }]
            }
          }
        }
      }
    }
  },
  data() {
    return {
      // 接口数据返回
      dataList: {
        total: 0,
        data: []
      },
      defaultSort: {},
      // 数据加载标识
      listLoading: false,
      // 选定和批量操作
      selectedIds: [],
      selectedObjs: [],
      // 显示已中多少项
      selectedLabel: '',
      // 显示批量操作
      multiShow: false,
      // 批量操作的标识
      multiNow: '',
      // 当前选择行
      selectedRow: {}
    }
  },
  created() {
    const sortRules = this.listQuery.pageModule.params.sortRules
    if (sortRules && sortRules.length > 0) {
      const sortRule = sortRules[0]
      if (sortRule.sortName) {
        this.defaultSort = {
          prop: sortRule.sortName,
          order: sortRule.sortOrder === 'ASC' ? 'ascending' : 'descending'
        }
      }
    }
    this.loadOrganizParameterValue('DefaultPageSize', '10', '表格默认每页记录数').then(res => {
      this.listQuery.pageModule.pageSize = parseInt(res)
    })
    this.loadOrganizParameterValue('DefaultPageSizes', '5,10,25,50,100', '表格默认每页记录数可选择项').then(res => {
      const temp = res.split(',')
      const pageSizes = []
      for (let i = 0; i < temp.length; i++) {
        pageSizes[i] = parseInt(temp[i])
      }
      this.listQuery.pageSizes = pageSizes
    })
    this.handleSearch()
  },
  methods: {
    caclColSpan(type) {
      const colSpan = this.listQuery.search.colSpan ? this.listQuery.search.colSpan : 5
      const search = this.listQuery.search.cols && this.listQuery.search.cols.length > 0 ? colSpan : 0
      const addButton = this.options.addAction.enable ? 2 : 0
      switch (type) {
        case 'search':
          return search
        case 'addButton':
          return addButton
        default:
          return 24 - search - addButton
      }
    },
    handleSortChange(column) {
      const sortRule = {
        sortOrder: (column.order && column.order === 'descending') ? 'DESC' : 'ASC',
        sortName: column.prop
      }
      this.listQuery.pageModule.params.sortRules = []
      this.listQuery.pageModule.params.sortRules.push(sortRule)
      if (column.prop) {
        this.handleSearch()
      }
      // 向外回调的操作
      this.$emit('handle-sort-change', column)
    },
    handleSizeChange(pageSize) {
      this.listQuery.pageModule.pageSize = pageSize
      this.handleSearch()
      // 向外回调的操作
      this.$emit('handle-size-change', pageSize)
    },
    handleCurrentChange(pageNumber) {
      this.listQuery.pageModule.pageNumber = pageNumber
      this.handleSearch()
      // 向外回调的操作
      this.$emit('handle-current-change', pageNumber)
    },
    /**
     * 添加数据跳转
     */
    handleAdd() {
      if (this.options.addAction.route) {
        this.$store.dispatch('pushToView', { name: this.options.addAction.route, params: {}})
        return
      }
      // 向外回调的操作
      this.$emit('handle-add')
    },
    /**
     * 查询数据列表
     */
    getList() {
      this.listLoading = true
      this.listQuery.pageModule.t = new Date().getTime()
      const cols = this.listQuery.search.cols
      if (cols && cols.length > 0) {
        for (let i = 0; i < cols.length; i++) {
          const col = cols[i]
          this.listQuery.pageModule.params[col] = this.listQuery.search.input
        }
      }
      this.postRequest(this.listQuery.listUrl, this.listQuery.pageModule).then(response => {
        this.dataList = response.data
        if (!this.dataList.data) {
          this.dataList.data = []
        }
        if (!this.dataList.total) {
          this.dataList.total = 0
        }
        this.listLoading = false
      }).catch((reason) => {
        this.listLoading = false
        this.$notify({
          title: '获取数据列表失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    /**
     * 搜索
     */
    handleSearch() {
      // 重新搜索
      this.getList()
      // 向外回调的操作
      this.$emit('handle-search', this.listQuery.search.input)
    },
    /**
     * 批量操作回调
     */
    handleAction(v) {
      this.multiNow = ''
      // 获取操作的选项完整数据
      const actionData = this.getActionData(v)
      if (this.selectedIds.length === 0) {
        this.$message({
          message: '请至少选择一条数据！',
          type: 'warning'
        })
        return
      }
      // 确认是否需要执行
      if (actionData.url) {
        if (actionData.confirm) {
          this.$confirm('确实要' + actionData.label + '吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.httpRequest(actionData)
          })
        } else {
          this.httpRequest(actionData)
        }
      }
      // 向外回调的操作
      this.$emit('multi-actions', { opt: actionData, ids: this.selectedIds })
    },
    httpRequest(actionData) {
      const data = { url: actionData.url, data: this.selectedIds, method: actionData.method || 'post' }
      this.allRequest(data).then(() => {
        this.$notify({
          title: actionData.label + '成功!',
          message: actionData.successMsg ? actionData.successMsg : actionData.label + '成功!',
          type: 'success',
          duration: 5000
        })
        this.handleSearch()
      }).catch((reason) => {
        this.$notify({
          title: actionData.failureMsg ? actionData.failureMsg : actionData.label + '失败!',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    getActionData(value) {
      const multiActions = this.options.multiActions
      if (multiActions && multiActions.length > 0) {
        for (let i = 0; i < multiActions.length; i++) {
          const multiAction = multiActions[i]
          if (multiAction.value === value) {
            return multiAction
          }
        }
      }
      return null
    },
    /**
     * 列表多选操作
     * @param val
     */
    handleSelection(val) {
      const ids = []
      val.forEach(row => {
        ids.push(row.id)
      })
      this.selectedObjs = val
      this.selectedIds = ids
      this.multiShow = ids.length > 0
      this.selectedLabel = '已选' + ids.length + '项'

      this.$emit('handle-row-selected', { ids: this.selectedIds, objs: this.selectedObjs })
    },
    handleRowClick(row, event, column) {
      if (!this.selectedRow || this.selectedRow.id !== row.id) {
        this.selectedRow = row
      }
      this.$emit('handle-row-click', row, event, column)
    },
    tableRowClassName({ row }) {
      if (this.options.tableRowClass) {
        const tableRowClass = this.options.tableRowClass
        const value = row[tableRowClass.column]
        const datas = tableRowClass.data
        if (value && datas && datas.length > 0) {
          for (let i = 0; i < datas.length; i++) {
            const data = datas[i]
            if (data.key === value) {
              return data.value
            }
          }
        }
      }
      return ''
    }
  }
}
</script>

<style>
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

.filter-container .filter-item {
  margin-left: 5px;
}

.filter-container .filter-item:first-child {
  margin-left: 0px;
}
</style>

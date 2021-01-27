<template>
  <div class="app-container">
    <div class="filter-container">
      <slot name="filter-content" />
      <el-row>
        <el-col :span="3">
          <div v-show="multiShow && options.multiActions" class="filter-container">
            <el-select
              v-model="multiNow"
              :placeholder="selectedLabel"
              class="filter-item"
              style="width: 130px"
              @change="handleOption"
            >
              <el-option
                v-for="item in options.multiActions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-col>
        <el-col :span="21">
          <div>
            <el-button-group style="vertical-align: top;">
              <el-button
                v-if="options.addRoute"
                v-waves
                round
                style="margin-left: 5px;"
                type="primary"
                icon="el-icon-plus"
                @click="handleAdd"
              >{{ $t('table.add') }}
              </el-button>
              <el-button v-waves round type="primary" icon="el-icon-search" @click="getList">
                {{ $t('table.refresh') }}
              </el-button>
            </el-button-group>
            <el-input
              v-if="listQuery.search.column"
              v-model="listQuery.search.input"
              :placeholder="listQuery.search.placeholder"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="getList"
            />
          </div>
        </el-col>
      </el-row>
    </div>

    <el-table
      v-loading="listLoading"
      :data="dataList.records"
      border
      fit
      highlight-current-row
      :header-cell-style="{'background':'#f2f3f4', 'color':'#555', 'font-weight':'bold', 'line-height':'32px'}"
      @selection-change="handleSelection"
    >
      <el-table-column
        v-if="options.multi"
        align="center"
        type="selection"
        width="55"
      />
      <slot name="data-columns" />
    </el-table>
    <div v-show="!listLoading && dataList.total>0" class="pagination-container">
      <el-pagination
        :current-page.sync="listQuery.current"
        :page-sizes="listQuery.pageSizes"
        :page-size="listQuery.size"
        :total="dataList.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { fetchList, deleteData, changeState } from '@/views/exam/common'

export default {
  name: 'PagingTable',
  // 组件入参
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          // 批量操作
          multiActions: [],
          // 列表请求URL
          listUrl: '/exam/api',
          // 删除请求URL
          deleteUrl: '',
          // 启用禁用
          stateUrl: '',
          // 可批量操作
          multi: false
        }
      }
    },
    // 列表查询参数
    listQuery: {
      type: Object,
      default: () => {
        return {
          current: 1,
          size: 10,
          pageSizes: [10, 20, 30, 50],
          params: {},
          t: 0,
          search: {
            column: '',
            input: '',
            placeholder: ''
          }
        }
      }
    }
  },
  data() {
    return {
      // 接口数据返回
      dataList: {
        total: 0
      },
      // 数据加载标识
      listLoading: true,
      // 选定和批量操作
      selectedIds: [],
      selectedObjs: [],
      // 显示已中多少项
      selectedLabel: '',
      // 显示批量操作
      multiShow: false,
      // 批量操作的标识
      multiNow: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val
      this.getList()
    },
    /**
     * 添加数据跳转
     */
    handleAdd() {
      if (this.options.addRoute) {
        this.$router.push({ name: this.options.addRoute, params: {}})
        return
      }
      console.log('未设置添加数据跳转路由！')
    },
    /**
     * 查询数据列表
     */
    getList() {
      this.listLoading = true
      this.listQuery.t = new Date().getTime()
      if (this.listQuery.search && this.listQuery.search.column) {
        this.listQuery.params[this.listQuery.search.column] = this.listQuery.search.input
      }
      fetchList(this.options.listUrl, this.listQuery).then(response => {
        this.dataList = response.data
        this.listLoading = false
      })
    },
    /**
     * 搜索
     */
    handleFilter() {
      // 重新搜索
      this.getList()
    },
    /**
     * 批量操作回调
     */
    handleOption(v) {
      this.multiNow = ''
      // 内部消化的操作
      if (v === 'delete') {
        this.handleDelete()
        return
      }
      if (v === 'enable') {
        this.handleState(0)
        return
      }
      if (v === 'disable') {
        this.handleState(1)
        return
      }
      // 向外回调的操作
      this.$emit('multi-actions', { opt: v, ids: this.selectedIds })
    },
    /**
     * 修改状态，启用禁用
     */
    handleState(state) {
      // 修改状态
      changeState(this.options.stateUrl, this.selectedIds, state).then(response => {
        if (response.data === true) {
          this.$message({
            type: 'success',
            message: '状态修改成功!'
          })

          // 重新搜索
          this.getList()
        }
      })
    },
    /**
     * 删除数据
     */
    handleDelete() {
      if (this.selectedIds.length === 0) {
        this.$message({
          message: '请至少选择一条数据！',
          type: 'warning'
        })
        return
      }
      // 删除
      this.$confirm('确实要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(this.options.deleteUrl, this.selectedIds).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      })
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

      this.$emit('select-changed', { ids: this.selectedIds, objs: this.selectedObjs })
    }

  }
}
</script>

<style>
.filter-container .filter-item {
  margin-left: 5px;
}

.filter-container .filter-item:first-child {
  margin-left: 0px;
}
</style>

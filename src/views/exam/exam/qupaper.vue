<template>
  <div>
    <div style="margin-bottom: 10px">
      <el-button type="primary" @click="addQu">选择试题</el-button>
      <el-button type="primary" @click="delQuList">删除试题</el-button>
    </div>
    <el-table
      ref="quTable"
      :data="quList"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :default-sort="{prop: 'quType', order: 'ascending'}"
      @selection-change="quSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55px"
        align="center"
        sortable
      />
      <el-table-column
        label="试题类型"
        prop="quType"
        align="center"
        width="120px"
        sortable
      >
        <template slot-scope="scope">
          {{ getAnanDicValue(quTypes, scope.row.quType) }}
        </template>
      </el-table-column>
      <el-table-column
        label="试题难度"
        prop="level"
        align="center"
        width="120px"
        sortable
      >
        <template slot-scope="scope">
          {{ getAnanDicValue(levels, scope.row.level) }}
        </template>
      </el-table-column>
      <el-table-column
        label="试题内容"
        prop="content"
        align="center"
        sortable
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="试题分值"
        align="center"
        width="130px"
        prop="score"
        sortable
      >
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.score"
            :min="0"
            style="width: 100%;"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" circle @click="removeItem(scope.$index,quList)" />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="选择试题"
      width="70%"
      top="15px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogFormVisible"
    >
      <el-row>
        <el-col :span="10">
          <el-select
            v-model="listQuery.params.quType"
            placeholder="选择题型"
            class="filter-item"
            clearable
          >
            <el-option
              v-for="item in quTypes"
              :key="item.name"
              :label="item.value"
              :value="item.name"
              :disabled="item.status === 1"
            />
          </el-select>
          <repo-tree-select :user-id="ananUserInfo.id" @nodeClick="onNodeClick" />
        </el-col>
        <el-col :span="7">
          <el-input
            v-if="listQuery.search.column"
            v-model="listQuery.search.input"
            :placeholder="listQuery.search.placeholder"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="getList"
          />
          <el-button v-waves round type="primary" icon="el-icon-search" @click="getList">
            {{ $t('table.refresh') }}
          </el-button>
        </el-col>
        <el-col :span="6">
          每题
          <el-input-number
            v-model="selecttionScore"
            style="width: 120px"
            :min="0"
          />分
          <el-button type="primary" @click="selectedQus">选好了</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="pagingTable"
        :data="dataList.records"
        fit
        highlight-current-row
        style="width: 100%"
        @selection-change="handleTableCheckChange"
        @sort-change="sortChange"
      >
        <el-table-column
          type="selection"
          width="55px"
          align="center"
        />
        <el-table-column
          label="试题类型"
          align="center"
          width="100px"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{ getAnanDicValue(quTypes, scope.row.quType) }}
          </template>
        </el-table-column>
        <el-table-column
          label="试题难度"
          align="center"
          width="100px"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{ getAnanDicValue(levels, scope.row.level) }}
          </template>
        </el-table-column>
        <el-table-column
          label="试题内容"
          prop="content"
          align="center"
          sortable="custom"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.content }}</span>
          </template>
        </el-table-column>
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
    </el-dialog>
  </div>
</template>

<script>
import RepoTreeSelect from '@/views/exam/components/RepoTreeSelect'
import { mapGetters } from 'vuex'

export default {
  name: 'Qupaper',
  components: { RepoTreeSelect },
  props: {
    // 试题列表
    quList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      // 数据加载标识
      listLoading: false,
      selecttionScore: 2,
      quTypes: [],
      levels: [],
      SelectionQus: [],
      SelectionQuList: [],
      dataList: [],
      listQuery: {
        current: 1,
        size: 10,
        params: {
          content: '',
          quType: '',
          state: 0,
          repoIds: []
        },
        sort: {
          sortOrder: 'DESC',
          sortName: ''
        },
        search: {
          column: 'content',
          input: '',
          placeholder: '搜索试题名称'
        }
      },
      options: {
        // 列表请求URL
        listUrl: 'gateway/exam/api/qu/qu/paging'
      }
    }
  },
  computed: {
    ...mapGetters(['ananUserInfo'])
  },
  created() {
    this.loadDictionaryById(146).then(res => {
      this.levels = res.details
    })
    this.loadDictionaryById(142).then(res => {
      this.quTypes = res.details
    })
    this.getList()
  },
  methods: {
    onNodeClick(node) {
      this.listQuery.params.repoIds = []
      if (node) {
        this.listQuery.params.repoIds.push(node.id)
      }
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
      this.postRequest(this.options.listUrl, this.listQuery).then(response => {
        this.dataList = response.data
        this.listLoading = false
      }).catch((reason) => {
        this.$notify({
          title: '获取数据列表失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    sortChange(column) {
      this.listQuery.sort.sortOrder = (column.order && column.order === 'descending') ? 'DESC' : 'ASC'
      this.listQuery.sort.sortName = column.prop
      if (this.listQuery.sort.sortName) {
        this.getList()
      }
    },
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    removeItem(index, data) {
      data.splice(index, 1)
    },
    addQu() {
      this.dialogFormVisible = true
    },
    delQuList() {
      if (this.SelectionQuList) {
        for (let i = 0; i < this.SelectionQuList.length; i++) {
          const qu = this.SelectionQuList[i]
          this.quList = this.quList.reduce((total, current) => {
            current.quId !== qu.quId && total.push(current)
            return total
          }, [])
        }
      }
    },
    selectedQus() {
      if (this.SelectionQus && this.SelectionQus.length > 0) {
        const objs = this.SelectionQus
        for (let i = 0; i < objs.length; i++) {
          const selectedQu = objs[i]
          const quId = selectedQu.id
          if (this.quList.find(function(x) { return x.quId === quId }) === undefined) {
            const qu = {
              examId: '',
              quId: quId,
              quType: selectedQu.quType,
              level: selectedQu.level,
              score: this.selecttionScore || 2,
              content: selectedQu.content
            }
            this.quList.push(qu)
          }
        }
      }
      this.$refs.pagingTable.clearSelection()
      this.dialogFormVisible = false
    },
    quSelectionChange(val) {
      this.SelectionQuList = val
    },
    handleTableCheckChange(val) {
      this.SelectionQus = val
    }
  }
}
</script>

<style scoped>

</style>

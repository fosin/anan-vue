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
          {{ getDicDetailValue(quTypes, scope.row.quType) }}
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
          {{ getDicDetailValue(levels, scope.row.level) }}
        </template>
      </el-table-column>
      <el-table-column
        label="试题内容"
        prop="content"
        align="center"
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
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogFormVisible"
    >
      <el-table
        ref="pagingTable"
        :data="quList"
        @select-changed="handleTableCheckChange"
      >
        <template slot="filter-content">
          <el-row>
            <el-col :span="5">
              <el-select v-model="listQuery.params.quType" placeholder="选择题型" class="filter-item" clearable>
                <el-option
                  v-for="item in quTypes"
                  :key="item.name"
                  :label="item.value"
                  :value="item.name"
                  :disabled="item.status === 1"
                />
              </el-select>
            </el-col>
            <el-col :span="5">
              <repo-select v-model="listQuery.params.repoIds" :multi="true" />
            </el-col>
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
            <el-col :span="4">
              每题
              <el-input-number
                v-model="selecttionScore"
                :min="0"
              />分
            </el-col>
            <el-col :span="3">
              <el-button type="primary" @click="selectedQus">选好了</el-button>
            </el-col>
          </el-row>
        </template>

        <template slot="data-columns">
          <el-table-column
            type="selection"
            width="55px"
            align="center"
          />
          <el-table-column
            label="试题类型"
            align="center"
            width="90px"
          >
            <template slot-scope="scope">
              {{ getDicDetailValue(quTypes, scope.row.quType) }}
            </template>
          </el-table-column>
          <el-table-column
            label="试题难度"
            align="center"
            width="90px"
          >
            <template slot-scope="scope">
              {{ getDicDetailValue(levels, scope.row.level) }}
            </template>
          </el-table-column>
          <el-table-column
            label="试题内容"
            prop="content"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.content }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import RepoSelect from '@/views/exam/components/RepoSelect'
import { fetchList } from '@/views/exam/common'

export default {
  name: 'Qupaper',
  components: { RepoSelect },
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
      listQuery: {
        current: 1,
        size: 10,
        params: {
          content: '',
          quType: '',
          state: 0,
          repoIds: []
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
  created() {
    this.loadDictionaryById(146).then(res => {
      this.levels = res.details
    })
    this.loadDictionaryById(142).then(res => {
      this.quTypes = res.details
    })
  },
  methods: {
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
      }).catch((reason) => {
        this.$notify({
          title: '获取数据列表失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
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
      if (this.SelectionQus && this.SelectionQus.objs) {
        const objs = this.SelectionQus.objs
        for (let i = 0; i < objs.length; i++) {
          const selectedQu = objs[i]
          const quId = selectedQu.id
          if (this.quList.find(function(x) { return x.quId === quId }) === undefined) {
            const qu = {
              examId: this.postForm.id,
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

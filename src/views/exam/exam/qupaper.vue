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
      width="90%"
      top="15px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogFormVisible"
    >
      <data-table
        ref="pagingTable"
        :options="options"
        :list-query="listQuery"
        style="width: 100%"
        @handle-row-selected="handleTableCheckChange"
      >
        <template slot="filter-content">
          <el-select
            v-model="listQuery.pageModule.params.quType"
            placeholder="选择题型"
            style="margin-left: 10px;"
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
          <repo-tree-select class="filter-item" :user-id="ananUserInfo.id" style="margin-left: 10px;" @nodeClick="onNodeClick" />
          <div class="filter-item" style="margin-left: 10px;">
            每题
            <el-input-number
              v-model="selecttionScore"
              style="width: 120px;"
              :min="0"
            />分
            <el-button type="primary" @click="selectedQus">选好了</el-button>
          </div>
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
            width="110px"
            prop="qu_type"
            sortable="custom"
            :sort-orders="['ascending','descending']"
          >
            <template slot-scope="scope">
              {{ getAnanDicValue(quTypes, scope.row.quType) }}
            </template>
          </el-table-column>
          <el-table-column
            label="试题难度"
            align="center"
            width="110px"
            prop="level"
            sortable="custom"
            :sort-orders="['ascending','descending']"
          >
            <template slot-scope="scope">
              {{ getAnanDicValue(levels, scope.row.level) }}
            </template>
          </el-table-column>
          <el-table-column
            label="试题内容"
            align="center"
            prop="content"
            sortable="custom"
            :sort-orders="['ascending','descending']"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.content }}</span>
            </template>
          </el-table-column>
        </template>
      </data-table>
    </el-dialog>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import RepoTreeSelect from '@/views/exam/components/RepoTreeSelect'
import { mapGetters } from 'vuex'

export default {
  name: 'Qupaper',
  components: { RepoTreeSelect, DataTable },
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
      selecttionScore: 2,
      quTypes: [],
      levels: [],
      SelectionQus: [],
      SelectionQuList: [],
      listQuery: {
        listUrl: 'gateway/exam/api/qu/qu/paging',
        pageSizes: [5, 10, 25, 50, 100],
        search: {
          input: null,
          cols: ['content'],
          placeholder: '搜索试题名称'
        },
        pageModule: {
          pageNumber: 1,
          pageSize: 10,
          params: {
            content: null,
            quType: null,
            state: 0,
            repoIds: [],
            sortRules: [{
              sortName: 'quType',
              sortOrder: 'ASC'
            }
            ]
          }
        }
      },
      options: {
        // 可批量操作
        multi: false,
        // 批量操作列表
        multiActions: [],
        addAction: {
          enable: false,
          route: '',
          permissionId: '0'
        },
        tableRowClass: {
          column: 'state',
          data: [
            {
              key: 1,
              value: 'info-row'
            }
          ]
        }
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
  },
  methods: {
    onNodeClick(node) {
      this.listQuery.pageModule.params.repoIds = []
      if (node) {
        this.listQuery.pageModule.params.repoIds.push(node.id)
      }
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
          let index = -1
          for (let j = 0; j < this.quList.length; j++) {
            if (this.quList[j].quId === qu.quId) {
              index = j
            }
          }
          if (index > -1) {
            this.removeItem(index, this.quList)
          }
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
        this.quList.sort(function(a, b) { return a.quType - b.quType })
      }
      this.$refs.pagingTable.$refs.dataTable.clearSelection()
      this.dialogFormVisible = false
    },
    quSelectionChange(val) {
      this.SelectionQuList = val
    },
    handleTableCheckChange(objs) {
      this.SelectionQus = objs
    }
  }
}
</script>

<style scoped>

</style>

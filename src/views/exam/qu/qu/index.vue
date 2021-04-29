<template>
  <div>
    <data-table
      ref="pagingTable"
      :options="options"
      :list-query="listQuery"
      @multi-actions="handleMultiAction"
    >
      <template slot="filter-content">
        <el-row>
          <el-col :span="4">
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
          </el-col>
          <el-col :span="4" class="filter-item">
            <repo-tree-select :user-id="ananUserInfo.id" :width="300" @nodeClick="onNodeClick" />
            <!--            <el-button-group class="filter-item" style="float:  right">
              <el-button size="mini" icon="el-icon-upload2" @click="showImport">导入</el-button>
              <el-button size="mini" icon="el-icon-download" @click="exportExcel">导出</el-button>
            </el-button-group>-->
          </el-col>
        </el-row>
      </template>

      <template slot="data-columns">
        <el-table-column
          label="试题类型"
          align="center"
          width="110px"
          prop="qu_type"
          sortable="custom"
          :sort-orders="['ascending','descending']"
        >
          <template slot-scope="scope">
            {{ getDicDetailValue(quTypes, scope.row.quType) }}
          </template>
        </el-table-column>
        <el-table-column
          label="试题难度"
          align="center"
          sortable="custom"
          :sort-orders="['ascending','descending']"
          prop="level"
          width="110px"
        >
          <template slot-scope="scope">
            {{ getDicDetailValue(levels, scope.row.level) }}
          </template>
        </el-table-column>
        <el-table-column
          label="试题内容"
          sortable="custom"
          :sort-orders="['ascending','descending']"
          prop="content"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <router-link :to="{ name: 'ExamManagementQuUpdate', params:{ id: scope.row.id}}">
              {{ scope.row.content }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
          prop="update_time"
          width="180px"
          sortable="custom"
          :sort-orders="['ascending','descending']"
        >
          <template slot-scope="scope">
            {{ scope.row.updateTime }}
          </template>
        </el-table-column>
        <el-table-column
          label="权重"
          align="center"
          prop="weight"
          width="80px"
          sortable="custom"
          :sort-orders="['ascending','descending']"
        />
        <el-table-column
          label="状态"
          align="center"
          prop="state"
          width="80px"
          sortable="custom"
          :sort-orders="['ascending','descending']"
        >
          <template slot-scope="scope">
            {{ getDicDetailValue(states, scope.row.state) }}
          </template>
        </el-table-column>
      </template>
    </data-table>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form label-position="left" label-width="100px">
        <el-form-item label="操作题库" prop="repoIds">
          <repo-tree-select v-model="dialogRepo" :width="300" />
        </el-form-item>
        <el-row>
          <el-button type="primary" @click="handlerRepoAction">保存</el-button>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog
      title="导入试题"
      :visible.sync="importVisible"
      width="30%"
    >
      <el-row>
        <el-button type="primary" @click="chooseFile">上传导入</el-button>
        <el-button type="warning" @click="downloadTemplate">下载导入模板</el-button>
        <input ref="upFile" class="file" name="file" type="file" style="display: none" @change="doImport">
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import DataTable from '@/views/exam/components/DataTable'
import { batchAction } from '@/views/exam/qu/repo/repo'
import RepoTreeSelect from '@/views/exam/components/RepoTreeSelect'
import { exportExcel, importExcel, importTemplate } from '@/views/exam/qu/qu/qu'
import { mapGetters } from 'vuex'

export default {
  name: 'ExamManagementQu',
  components: { RepoTreeSelect, DataTable },
  data() {
    return {
      dialogTitle: '加入题库',
      dialogVisible: false,
      importVisible: false,
      dialogRepo: '',
      dialogQuIds: [],
      dialogFlag: false,
      listQuery: {
        current: 1,
        size: 10,
        params: {
          content: '',
          quType: '',
          code: ''
        },
        sort: {
          sortOrder: 'DESC',
          sortName: 'update_time'
        },
        search: {
          column: 'content',
          input: '',
          placeholder: '搜索试题名称'
        }
      },
      quTypes: [],
      levels: [],
      states: [],
      options: {
        // 可批量操作
        multi: true,
        // 批量操作列表
        multiActions: [
          {
            value: 'delete',
            label: this.$t('table.delete')
          }, {
            value: 'enable',
            label: this.$t('table.enable')
          },
          {
            value: 'disable',
            label: this.$t('table.disable')
          },
          {
            value: 'add-repo',
            label: '加入题库..'
          },
          {
            value: 'remove-repo',
            label: '从..题库移除'
          }
        ],
        // 列表请求URL
        listUrl: 'gateway/exam/api/qu/qu/paging',
        // 删除请求URL
        deleteUrl: 'gateway/exam/api/qu/qu/delete',
        // 启用禁用
        stateUrl: 'gateway/exam/api/qu/qu/state',
        // 添加数据路由
        addRoute: 'ExamManagementQuAdd'
      }
    }
  },
  computed: {
    ...mapGetters(['ananUserInfo'])
  },
  created() {
    this.loadDictionaryById(142).then(res => {
      this.quTypes = res.details
    })
    this.loadDictionaryById(146).then(res => {
      this.levels = res.details
    })
    this.loadDictionaryById(11).then(res => {
      this.states = res.details
    })
  },
  methods: {
    onNodeClick(node) {
      this.listQuery.params.code = node ? node.code : ''
    },
    handleMultiAction(obj) {
      if (obj.opt === 'add-repo') {
        this.dialogTitle = '加入题库'
        this.dialogFlag = false
      }
      if (obj.opt === 'remove-repo') {
        this.dialogTitle = '从题库移除'
        this.dialogFlag = true
      }

      this.dialogVisible = true
      this.dialogQuIds = obj.ids
    },
    handlerRepoAction() {
      const postForm = { repoIds: [], quIds: this.dialogQuIds, remove: this.dialogFlag }
      postForm.repoIds.push(this.dialogRepo)
      batchAction(postForm).then(() => {
        this.$notify({
          title: '成功',
          message: '批量操作成功！',
          type: 'success',
          duration: 2000
        })

        this.dialogVisible = false
        this.$refs.pagingTable.getList()
      }).catch((reason) => {
        this.$notify({
          title: '批量处理失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    exportExcel() {
      // 导出当前查询的数据
      exportExcel(this.listQuery.params)
    },
    downloadTemplate() {
      importTemplate()
    },
    showImport() {
      this.importVisible = true
    },
    // 只是为了美化一下导入按钮
    chooseFile: function() {
      this.$refs.upFile.dispatchEvent(new MouseEvent('click'))
    },
    doImport(e) {
      const file = e.target.files[0]
      importExcel(file).then(res => {
        if (res.data.code !== 0) {
          this.$alert(res.data.msg, '导入信息', {
            dangerouslyUseHTMLString: true
          })
        } else {
          this.$message({
            message: '数据导入成功！',
            type: 'success'
          })

          this.importVisible = false
          this.$refs.pagingTable.getList()
        }
      }).catch((reason) => {
        this.$notify({
          title: '导入excel失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    }
  }
}
</script>

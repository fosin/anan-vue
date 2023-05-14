<template>
  <div>
    <data-table
      ref="pagingTable"
      :options="options"
      :list-query="listQuery"
      @multi-actions="handleMultiAction"
    >
      <template slot="filter-content">
        <el-select
          v-model="listQuery.pageModule.params.quType"
          placeholder="选择题型"
          clearable
          class="filter-item"
          style="margin-left: 5px;"
        >
          <el-option
            v-for="item in quTypes"
            :key="item.name"
            :label="item.value"
            :value="item.name"
            :disabled="item.status === 1"
          />
        </el-select>
        <repo-tree-select class="filter-item" :user-id="ananUserInfo.id" :width="300" style="margin-left: 5px;" @nodeClick="onNodeClick" />
        <!--<el-button-group class="filter-item" style="float:  right">
              <el-button size="mini" icon="el-icon-upload2" @click="showImport">导入</el-button>
              <el-button size="mini" icon="el-icon-download" @click="exportExcel">导出</el-button>
            </el-button-group>-->
      </template>

      <template slot="data-columns">
        <el-table-column
          label="题型"
          align="center"
          width="80px"
          prop="quType"
          sortable="custom"
          :sort-orders="['ascending','descending']"
        >
          <template slot-scope="scope">
            {{ getAnanDicValue(quTypes, scope.row.quType) }}
          </template>
        </el-table-column>
        <el-table-column
          label="难度"
          align="center"
          sortable="custom"
          :sort-orders="['ascending','descending']"
          prop="level"
          width="80px"
        >
          <template slot-scope="scope">
            {{ getAnanDicValue(levels, scope.row.level) }}
          </template>
        </el-table-column>
        <el-table-column
          label="内容"
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
            {{ getAnanDicValue(states, scope.row.state) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.updateBy.label')" align="center" sortable prop="updateBy" width="100px">
          <template slot-scope="scope">
            <span>{{ getDicValue(organizTopUsers,"id",scope.row.updateBy,"username") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.updateTime.label')"
          align="center"
          prop="updateTime"
          width="160px"
          sortable="custom"
          :sort-orders="['ascending','descending']"
        />
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
import DataTable from '@/components/DataTable'
import RepoTreeSelect from '@/views/exam/components/RepoTreeSelect'
import { exportExcel, importExcel, importTemplate } from '@/views/exam/qu/qu/qu'
import { batchAction } from '@/views/exam/qu/repo/repo'
import { listUserByTopId } from '@/views/platform/user/user'
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
      organizTopUsers: [],
      dialogFlag: false,
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
            code: null,
            sortRules: [{
              sortName: 'updateTime',
              sortOrder: 'DESC'
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
            url: 'gateway/exam/api/qu/qu/ids',
            method: 'delete',
            permissionId: '0',
            confirm: true
          },
          {
            value: 'disable',
            label: this.$t('table.disable'),
            url: 'gateway/exam/api/qu/qu/field/state/1',
            method: 'put',
            permissionId: '0',
            confirm: true
          },
          {
            value: 'enable',
            label: this.$t('table.enable'),
            url: 'gateway/exam/api/qu/qu/field/state/0',
            method: 'put',
            permissionId: '0',
            confirm: false
          },
          {
            value: 'add-repo',
            label: '加入题库',
            permissionId: '0'
          },
          {
            value: 'remove-repo',
            label: '从题库移除',
            permissionId: '0'
          }
        ],
        addAction: {
          enable: true,
          route: 'ExamManagementQuAdd',
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
      },
      quTypes: [],
      levels: [],
      states: []
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
    onNodeClick(node) {
      this.listQuery.pageModule.params.code = node ? node.code : ''
    },
    handleMultiAction(obj) {
      if (obj.opt.value === 'add-repo') {
        this.dialogTitle = '加入题库'
        this.dialogFlag = false
        this.dialogVisible = true
      }
      if (obj.opt.value === 'remove-repo') {
        this.dialogTitle = '从题库移除'
        this.dialogFlag = true
        this.dialogVisible = true
      }
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
      exportExcel(this.listQuery.pageModule.params)
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
        if (res.data.data.code !== 0) {
          this.$alert(res.data.data.msg, '导入信息', {
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

<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group>
        <el-button v-waves round class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch()">
          {{ $t('table.refresh') }}
        </el-button>
        <el-button
          v-waves
          round
          class="filter-item"
          style="margin-left: 5px;"
          type="primary"
          icon="el-icon-circle-plus"
          @click="handleAdd()"
        >
          {{ $t('table.add') }}
        </el-button>
      </el-button-group>
    </div>
    <el-table
      ref="pagingTable"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      lazy
      highlight-current-row
      default-expand-all
      :load="loadRepoChild"
      :data="repoData"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        label="题库名称"
        prop="title"
        width="400px"
      />
      <el-table-column
        label="题库编号"
        prop="code"
        align="center"
        width="180px"
      />
      <el-table-column label="总题数" align="center" prop="" width="90px">
        <template slot-scope="scope">
          <span>{{ scope.row.radioCount + scope.row.multiCount + scope.row.judgeCount + scope.row.saqCount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="单选数量"
        prop="radioCount"
        align="center"
        width="100px"
      />
      <el-table-column
        label="多选数量"
        prop="multiCount"
        align="center"
        width="100px"
      />
      <el-table-column
        label="判断数量"
        prop="judgeCount"
        align="center"
        width="100px"
      />
      <el-table-column
        label="简答数量"
        prop="saqCount"
        align="center"
        width="100px"
      />
      <el-table-column :label="$t('table.updateBy.label')" align="center" prop="updateBy" width="100px">
        <template slot-scope="scope">
          <span>{{ getDicValue(organizTopUsers,"id",scope.row.updateBy,"username") }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.updateTime.label')" width="160px" align="center" sortable prop="updateTime" />
      <el-table-column :label="$t('table.actions')" align="center" width="120" fixed="right">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="$t('table.edit')" placement="top">
            <el-button
              v-waves
              round
              size="mini"
              class="filter-item"
              type="success"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('table.delete')" placement="top">
            <el-button
              v-waves
              round
              size="mini"
              class="filter-item"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px" @closed="onDialogClosed">
      <exam-management-repo-add v-if="dialogFormVisible" :repo-id="repoId" @submit="handleFormSubmit" @cancel="handleFormCancel" />
    </el-dialog>
  </div>
</template>

<script>
import { deleteRepos, fetchRepoChild } from '@/views/exam/qu/repo/repo'
import ExamManagementRepoAdd from '@/views/exam/qu/repo/form'
import { listUserByTopId } from '@/views/platform/user/user'

export default {
  name: 'ExamManagementRepo',
  components: { ExamManagementRepoAdd },
  data() {
    return {
      listLoading: false,
      dialogStatus: null,
      dataChanged: false,
      dialogFormVisible: false,
      repoForm: {},
      organizTopUsers: [],
      repoId: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      repoData: undefined
    }
  },
  watch: {
    dialogStatus(val) {
      this.dialogFormVisible = val !== null
    }
  },
  created() {
    listUserByTopId().then(response => {
      this.organizTopUsers = response.data
    }).catch(reason => {
      this.$notify({
        title: '获取所有用户失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
    this.handleSearch()
  },
  methods: {
    onDialogClosed() {
      this.dialogStatus = null
    },
    handleSearch() {
      this.listLoading = true
      this.repoData = undefined
      fetchRepoChild(0).then(res => {
        this.listLoading = false
        if (res.data && res.data.length > 0) {
          this.repoData = res.data
          for (let i = 0; i < this.repoData.length; i++) {
            const repo = this.repoData[i]
            repo.hasChildren = !repo.leaf
          }
        }
      }).catch((reason) => {
        this.listLoading = false
        this.$notify({
          title: '获取根题库数据失败!',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    handleAdd() {
      this.repoId = ''
      this.dialogStatus = 'create'
    },
    handleFormSubmit(flag) {
      if (flag === 1) {
        if (this.repoId && this.repoId.length > 0) {
          this.dialogStatus = null
          this.handleSearch()
        }
        this.dataChanged = true
      }
    },
    handleFormCancel() {
      this.dialogStatus = null
      if (this.dataChanged) {
        this.dataChanged = false
        this.handleSearch()
      }
    },
    handleEdit(row) {
      this.repoForm = row
      if (!this.repoForm || !this.repoForm.id) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      this.repoId = this.repoForm.id
      this.dialogStatus = 'edit'
    },
    handleDelete(row) {
      this.repoForm = row
      if (!this.repoForm || !this.repoForm.id || !this.repoForm.title) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      if (this.repoForm.hasChildren === true) {
        this.$message({
          message: '该数据是上级题库不能直接删除，请先删除其子节点!'
        })
        return
      }
      this.$confirm(
        '此操作将永久删除题库名( ' + this.repoForm.title + ' )的相关数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const data = {
          ids: new Array(this.repoForm.id)
        }
        deleteRepos(data).then(() => {
          this.$notify({
            title: '删除题库成功',
            type: 'success',
            duration: 5000
          })
          this.handleSearch()
        }).catch(reason => {
          this.$notify({
            title: '删除题库失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      }).catch(() => {
      })
    },
    loadRepoChild(row, treeNode, resolve) {
      let repoData = []
      fetchRepoChild(row.id).then(res => {
        if (res.data && res.data.length > 0) {
          repoData = res.data
          for (let i = 0; i < repoData.length; i++) {
            const repo = repoData[i]
            repo.hasChildren = !repo.leaf
          }
        }
        resolve(repoData)
      }).catch((reason) => {
        this.$notify({
          title: '获取子题库数据失败!',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
        resolve(repoData)
      })
    }
  }
}
</script>

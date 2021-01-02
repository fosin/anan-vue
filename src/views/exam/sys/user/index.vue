<template>

  <div>

    <data-table
      ref="pagingTable"
      :options="options"
      :list-query="listQuery"
      @multi-actions="handleMultiAction"
    >

      <template slot="filter-content">

        <el-input v-model="listQuery.params.userName" style="width: 200px" placeholder="搜索登录名" class="filter-item" />
        <el-input v-model="listQuery.params.realName" style="width: 200px" placeholder="搜索姓名" class="filter-item" />

        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">
          添加
        </el-button>

      </template>

      <template slot="data-columns">

        <el-table-column
          type="selection"
          width="55"
        />

        <el-table-column
          align="center"
          label="用户名"
        >
          <template slot-scope="scope">
            <a @click="handleUpdate(scope.row)">{{ scope.row.userName }}</a>
          </template>

        </el-table-column>

        <el-table-column
          align="center"
          label="姓名"
          prop="realName"
        />

        <el-table-column
          align="center"
          label="角色"
          prop="roleIds"
        />

        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
        />

        <el-table-column
          align="center"
          label="状态"
        >

          <template slot-scope="scope">
            {{ getDicDetailValue(onStates, scope.row.state) }}
          </template>
        </el-table-column>

      </template>
    </data-table>

    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="500px">

      <el-form :model="formData" label-position="left" label-width="100px">

        <el-form-item label="用户名">
          <el-input v-model="formData.userName" />
        </el-form-item>

        <el-form-item label="姓名">
          <el-input v-model="formData.realName" />
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="formData.password" placeholder="不修改请留空" type="password" />
        </el-form-item>

        <el-form-item label="部门">
          <depart-tree-select v-model="formData.departId" :options="treeData" :props="defaultProps" />
        </el-form-item>

        <el-form-item label="角色">
          <meet-role v-model="formData.roles" />
        </el-form-item>

        <!--        <el-form-item label="头像" prop="avatar">-->

        <!--          <single-upload-->
        <!--            v-model="formData.avatar"-->
        <!--          />-->
        <!--        </el-form-item>-->

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </div>

    </el-dialog>

  </div>

</template>

<script>
import DataTable from '@/views/exam/components/DataTable'
import MeetRole from '@/views/exam/components/MeetRole'
import { saveData } from '@/views/exam/sys/user/user'
import DepartTreeSelect from '@/views/exam/components/DepartTreeSelect'
import { fetchTree } from '@/views/exam/sys/depart/depart'

export default {
  name: 'SysUserList',
  components: { DepartTreeSelect, DataTable, MeetRole },
  filters: {
    // 订单状态
    userState(value) {
      const map = {
        '0': '正常',
        '1': '禁用'
      }
      return map[value]
    }
  },
  data() {
    return {
      treeData: [],
      onStates: [],
      defaultProps: {
        value: 'id',
        label: 'deptName',
        children: 'children'
      },
      dialogVisible: false,

      listQuery: {
        current: 1,
        size: 10,
        params: {
        }
      },
      formData: {
        avatar: ''
      },

      options: {
        // 列表请求URL
        listUrl: 'gateway/exam/api/sys/user/paging',
        // 启用禁用
        stateUrl: '/sys/user/state',
        deleteUrl: 'gateway/exam/api/sys/user/delete',
        // 批量操作列表
        multiActions: [
          {
            value: 'enable',
            label: this.$t('table.enable')
          }, {
            value: 'disable',
            label: this.$t('table.disable')
          },
          {
            value: 'delete',
            label: this.$t('table.delete')
          }
        ]
      }
    }
  },

  created() {
    this.loadDictionaryById(11).then(res => {
      this.onStates = res.details
    }).catch((error) => {
      this.$notify({
        title: '加载字典试卷状态失败',
        message: error.message,
        type: 'error',
        duration: 5000
      })
    })
    fetchTree({}).then(response => {
      this.treeData = response.data
    })
  },

  methods: {

    handleUploadSuccess(response) {
      // 上传图片赋值
      this.formData.avatar = response.data.url
    },

    handleAdd() {
      this.formData = {}
      this.dialogVisible = true
    },

    handleUpdate(row) {
      this.dialogVisible = true
      this.formData = row
      this.formData.roles = row.roleIds.split(',')
      this.formData.password = null

      console.log(JSON.stringify(this.formData))
    },

    departSelected(data) {
      this.formData.departId = data.id
    },
    handleSave() {
      saveData(this.formData).then(() => {
        this.$message({
          type: 'success',
          message: '用户修改成功!'
        })
        this.dialogVisible = false
        this.$refs.pagingTable.getList()
      })
    },

    // 批量操作监听
    handleMultiAction(obj) {
      if (obj.opt === 'cancel') {
        this.handleCancelOrder(obj.ids)
      }
    }
  }
}
</script>

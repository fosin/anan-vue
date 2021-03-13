<template>
  <div class="app-container">
    <el-form ref="repoForm" :model="repoForm" :rules="rules" label-position="left">
      <el-card>
        <el-form-item label="上级题库" prop="pId" label-width="80px">
          <repo-tree-select ref="repoTree" v-model="repoForm.pId" :width="400" @nodeClick="nodeClick" />
        </el-form-item>
        <el-form-item label="题库编码" prop="code" label-width="80px">
          <el-input v-model="repoForm.code" />
        </el-form-item>
        <el-form-item label="题库名称" prop="title" label-width="80px">
          <el-input v-model="repoForm.title" />
        </el-form-item>
        <el-form-item label="权限用户" prop="userList" label-width="80px">
          <organiz-user-select v-model="userIds" :multi="true" :width="400" />
        </el-form-item>
        <el-form-item label="题库备注" prop="remark">
          <el-input v-model="repoForm.remark" type="textarea" />
        </el-form-item>
      </el-card>
      <div style="margin-top: 20px">
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button type="info" @click="onCancel">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>

import { fetchDetail, saveData } from '@/views/exam/qu/repo/repo'
import RepoTreeSelect from '@/views/exam/components/RepoTreeSelect'
import OrganizUserSelect from '@/components/OrganizUserSelect'

export default {
  name: 'ExamManagementRepoAdd',
  components: { OrganizUserSelect, RepoTreeSelect },
  props: {
    repoId: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateCode = (rule, value, callback) => {
      if (this.repoParentForm && this.repoParentForm.id && this.repoForm.id !== this.repoParentForm.id) {
        if (value.substring(0, this.repoParentForm.code.length) !== this.repoParentForm.code) {
          callback(new Error('题库编码必须以父题库编码为前缀!'))
        }
        if (value === this.repoParentForm.code) {
          callback(new Error('题库编码不能和父题库编码相同!'))
        }
      }
      if (this.$refs.repoTree.isRepoCodeExsit(value, this.repoForm.id)) {
        callback(new Error('该编码已存在，请修改一个新值!'))
      }
      callback()
    }
    return {
      repoForm: {},
      repoParentForm: {},
      loading: false,
      code: '',
      userIds: [],
      rules: {
        title: [
          { required: true, message: '题库名称不能为空！' }
        ],
        code: [
          {
            required: true,
            message: '题库编码不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 64,
            message: '长度在 1 到 64 个字符',
            trigger: 'blur'
          },
          { validator: validateCode, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.repoId && this.repoId.length > 0) {
      this.fetchData(this.repoId)
    } else {
      this.initForm()
    }
  },
  methods: {
    nodeClick(node) {
      if (node) {
        this.repoParentForm = node
        this.repoForm.code = node.code
      } else {
        this.repoParentForm = {}
        this.repoForm.code = ''
      }
    },
    fetchData(id) {
      const params = { id: id }
      fetchDetail(params).then(response => {
        this.repoForm = response.data
        if (this.repoForm.userList && this.repoForm.userList.length > 0) {
          for (let i = 0; i < this.repoForm.userList.length; i++) {
            this.userIds.push(this.repoForm.userList[i].userId)
          }
        }
        fetchDetail({ id: this.repoForm.pId }).then(response => {
          this.repoParentForm = response.data
        }).catch((reason) => {
          this.$notify({
            title: '父题库数据失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      }).catch((reason) => {
        this.$notify({
          title: '获取题库数据失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    submitForm() {
      this.$refs.repoForm.validate((valid) => {
        if (!valid) {
          return
        }
        this.repoForm.userList = []
        if (this.userIds && this.userIds.length > 0) {
          for (let i = 0; i < this.userIds.length; i++) {
            const repouser = {
              userId: this.userIds[i],
              repoId: this.repoForm.id
            }
            this.repoForm.userList.push(repouser)
          }
        }
        saveData(this.repoForm).then(() => {
          this.$notify({
            title: '成功',
            message: '题库保存成功！',
            type: 'success',
            duration: 2000
          })
          this.$emit('submit', 1)
        }).catch((reason) => {
          this.$notify({
            title: '保存题库数据失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
          this.$emit('submit', -1)
        })
      })
    },
    onCancel() {
      this.$emit('cancel')
    },
    initForm() {
      this.repoForm = {
        pId: '',
        id: '',
        code: '',
        title: '',
        remark: '',
        userList: []
      }
      this.repoParentForm = {}
      this.userIds = []
    }
  }
}
</script>

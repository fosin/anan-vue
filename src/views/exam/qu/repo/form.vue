<template>
  <div class="app-container">
    <el-form ref="repoForm" :model="repoForm" :rules="rules">
      <el-card>
        <el-form-item label="上级题库" prop="pId">
          <repo-tree-select v-model="repoForm.pId" @nodeClick="nodeClick" />
        </el-form-item>
        <el-form-item label="题库名称" prop="title">
          <el-input v-model="repoForm.title" />
        </el-form-item>
        <el-form-item label="题库编码" prop="code">
          <el-input v-model="repoForm.code" />
        </el-form-item>
        <el-form-item label="权限用户" prop="userList">
          <organiz-user-select v-model="userIds" :multi="true" />
        </el-form-item>
        <el-form-item label="题库备注" prop="remark">
          <el-input v-model="repoForm.remark" type="textarea" />
        </el-form-item>
      </el-card>
      <div style="margin-top: 20px">
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button type="info" @click="onCancel">返回</el-button>
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
  data() {
    const validateCode = (rule, value, callback) => {
      if (this.repoForm.id !== this.repoParentForm.id) {
        if (value.substring(0, this.repoParentForm.code.length) !== this.repoParentForm.code) {
          callback(new Error('题库编码必须以父题库编码为前缀!'))
        }
        if (value === this.repoParentForm.code) {
          callback(new Error('题库编码不能和父题库编码相同!'))
        }
      }
      callback()
    }
    return {
      repoForm: {
        pId: '',
        code: '',
        title: '',
        remark: '',
        userIds: []
      },
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
        ],
        pId: [
          { required: true, message: '上级题库不能为空！' }
        ]
      }
    }
  },
  created() {
    const id = this.$route.params.id
    if (typeof id !== 'undefined') {
      this.fetchData(id)
    }
  },
  methods: {
    nodeClick(node) {
      this.repoParentForm = node
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
          this.$store.dispatch('closeAndPushToView', { name: 'ExamManagementRepo' })
        }).catch((reason) => {
          this.$notify({
            title: '保存题库数据失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      })
    },
    onCancel() {
      this.$store.dispatch('closeAndPushToView', { name: 'ExamManagementRepo' })
    }
  }
}
</script>

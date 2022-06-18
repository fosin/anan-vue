<template>
  <div class="app-container">
    <el-form ref="repoForm" :model="repoForm" :rules="rules" label-position="left">
      <el-card>
        <el-form-item label="上级题库" prop="pid" label-width="80px">
          <repo-tree-select ref="repoTree" v-model="repoForm.pid" :user-id="ananUserInfo.id" :width="400" @nodeClick="nodeClick" />
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

import OrganizUserSelect from '@/components/OrganizUserSelect'
import RepoTreeSelect from '@/views/exam/components/RepoTreeSelect'
import { createOrUpdate, fetchDetail } from '@/views/exam/qu/repo/repo'
import { mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters(['ananUserInfo'])
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
        this.repoForm.code = node.code + String((node.children ? node.children.length : 0) + 1).padStart(2, '0')
      } else {
        this.repoParentForm = {}
        this.repoForm.code = ''
      }
    },
    fetchData(id) {
      fetchDetail(id).then(response => {
        this.repoForm = response.data.data
        if (this.repoForm.userList && this.repoForm.userList.length > 0) {
          for (let i = 0; i < this.repoForm.userList.length; i++) {
            this.userIds.push(this.repoForm.userList[i].userId)
          }
        }
        this.repoParentForm = {}
        if (this.repoForm.pid && this.repoForm.pid !== '0') {
          fetchDetail(this.repoForm.pid).then(response => {
            this.repoParentForm = response.data.data
          }).catch((reason) => {
            this.$notify({
              title: '父题库数据失败',
              message: reason.message,
              type: 'error',
              duration: 5000
            })
          })
        }
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
        createOrUpdate(this.repoForm).then(() => {
          this.$notify({
            title: '成功',
            message: '题库保存成功！',
            type: 'success',
            duration: 2000
          })
          if (this.repoParentForm.children) {
            this.repoParentForm.children.push(this.repoForm)
          }
          this.initForm()
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
      let newCode = ''
      let pid = ''
      if (this.repoParentForm.id) {
        newCode = this.repoParentForm.code + String((this.repoParentForm.children ? this.repoParentForm.children.length : 0) + 1).padStart(2, '0')
        pid = this.repoParentForm.id
      }
      this.repoForm = {
        id: '',
        pid: pid,
        code: newCode,
        title: '',
        remark: '',
        userList: []
      }
      // this.repoParentForm = {}
      this.userIds = []
    }
  }
}
</script>

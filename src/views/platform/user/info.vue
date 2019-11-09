<template>
  <div class="app-container calendar-list-container">
    <div class="grid-content bg-purple">
      <el-form ref="user" :model="userInfo" label-width="100px" class="demo-ruleForm">
        <span>{{ $t('anan_user.baseInfo') }}</span>
        <hr>
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('anan_user.usercode.label')" prop="usercode">
              <span>{{ userInfo.usercode }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('anan_user.username.label')" prop="username">
              <span>{{ userInfo.username }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('anan_user.sex.label')" prop="sex">
              <span>{{ getSexName(userInfo.sex) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('anan_user.birthday.label')" prop="birthday">
              <span>{{ userInfo.birthday | dateFormatFilter('yyyy-MM-dd') }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('anan_user.phone.label')" prop="phone">
              <span>{{ userInfo.phone }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('anan_user.email.label')" prop="email">
              <span>{{ userInfo.email }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <span>{{ $t('anan_user.modifyPassword') }}</span>
        <hr>
      </el-form>
      <el-form ref="user" :model="userInfo2" :rules="rules2" label-width="100px" class="demo-ruleForm">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('anan_user.oldPassword.label')" prop="password" label-width="200px">
              <el-input v-model="userInfo2.password" :placeholder="$t('anan_user.oldPassword.placeholder')" type="password" auto-complete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('anan_user.confirmPassword1.label')" prop="confirmPassword1" label-width="200px">
              <el-input v-model="userInfo2.confirmPassword1" :placeholder="$t('anan_user.confirmPassword1.placeholder')" type="password" auto-complete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('anan_user.confirmPassword2.label')" prop="confirmPassword2" label-width="200px">
              <el-input v-model="userInfo2.confirmPassword2" :placeholder="$t('anan_user.confirmPassword2.placeholder')" type="password" auto-complete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" :push="4">
            <el-form-item>
              <el-button v-waves round type="primary" autofocus icon="el-icon-circle-check" @click="update">
                {{ $t('table.confirm') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { changePassword } from './user'
import { formatDate } from '@/utils/date'

export default {
  filters: {
    dateFormatFilter(date, pattern) {
      return formatDate(date, pattern || 'yyyy-MM-dd HH:mm:ss')
    }
  },
  data() {
    const password = (rule, value, callback) => {
      if (value === '' || value === undefined || value === null) {
        callback(new Error('请输入当前密码'))
      } else {
        callback()
      }
    }
    const validateConfirmPassword1 = (rule, value, callback) => {
      if (value === '' || value === undefined || value === null) {
        callback(new Error('请输入新密码'))
      } else if (value.length < 6 || value.length > 30) {
        callback(new Error('新密码长度需要在6位-30位之间'))
      } else if (value === this.userInfo2.password) {
        callback(new Error('新密码不能和原密码相同!'))
      } else {
        callback()
      }
    }
    const validateConfirmPassword2 = (rule, value, callback) => {
      if (value === '' || value === undefined || value === null) {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.userInfo2.confirmPassword1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      fileList: [],
      sexOptions: [],
      show: false,
      userInfo2: {
        id: undefined,
        password: undefined,
        confirmPassword1: undefined,
        confirmPassword2: undefined
      },
      rules2: {
        password: [{ validator: password, trigger: 'blur', required: true }],
        confirmPassword1: [{ validator: validateConfirmPassword1, trigger: 'blur', required: true }],
        confirmPassword2: [{ validator: validateConfirmPassword2, trigger: 'blur', required: true }]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.asyncLoadDictionaryByCode(15, (data) => {
      this.sexOptions = data
    })
    this.userInfo2.id = this.userInfo.id
    this.userInfo2.password = ''
    this.userInfo2.confirmPassword1 = ''
    this.userInfo2.confirmPassword2 = ''
  },
  methods: {
    update() {
      this.$refs.user.validate(valid => {
        if (valid) {
          this.$confirm(
            '修改密码成功后将需要重新登录系统，确认继续吗?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            changePassword(this.userInfo2).then(response => {
              this.$notify({
                title: '修改信息成功',
                message: '',
                type: 'success',
                duration: 2000
              })
              // 修改密码之后强制重新登录
              this.$store.dispatch('LogOut').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
              })
            }).catch((reason) => {
              this.$notify({
                title: '修改信息失败',
                message: reason.message,
                type: 'error',
                duration: 5000
              })
            })
          }).catch(() => {})
        } else {
          return false
        }
      })
    },
    getSexName(type) {
      const typeOption = this.sexOptions.filter(value => {
        return value.name === type
      })
      return typeOption.length > 0 ? typeOption[0].value : type
    },
    resetForm() {
      this.$refs.user.resetFields()
    }
  }
}
</script>

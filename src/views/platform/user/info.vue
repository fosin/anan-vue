<template>
  <div class="app-container calendar-list-container">

    <div class="grid-content bg-purple">
      <el-form :model="userInfo" :rules="rules2" ref="user" label-width="100px" class="demo-ruleForm">
        <span>基本信息</span>
        <hr/>
        <el-row>
          <el-col :span="6">
            <el-form-item label="用户工号:" prop="usercode">
              <span>{{userInfo.usercode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户名称:" prop="username">
              <span>{{userInfo.username}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="性别:" prop="sex">
              <span>{{getSexName(userInfo.sex)}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户生日:" prop="birthday">
              <span>{{userInfo.birthday | dateFormatFilter('yyyy-MM-dd')}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="手机号码:" prop="phone">
              <span>{{userInfo.phone}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户邮箱:" prop="email">
              <span>{{userInfo.email}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <span>修改密码</span>
        <hr/>
        <el-row>
          <el-col :span="8">
            <el-form-item label="当前密码" prop="password" width>
              <el-input type="password" v-model="userInfo.password" placeholder="请输入用户当前密码" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="新密码" prop="confirmPassword1">
              <el-input type="password" v-model="userInfo.confirmPassword1" placeholder="请输入用户新密码" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="确认新密码" prop="confirmPassword2">
              <el-input type="password" v-model="userInfo.confirmPassword2" placeholder="请再次输入用户新密码" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" autofocus @click="update">{{$t('table.confirm')}}</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>


<script>
  import { mapGetters } from 'vuex'
  import { changePassword } from '@/api/user'
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
        } else if (value === this.userInfo.password) {
          callback(new Error('新密码不能和原密码相同!'))
        } else {
          callback()
        }
      }
      const validateConfirmPassword2 = (rule, value, callback) => {
        if (value === '' || value === undefined || value === null) {
          callback(new Error('请再次输入新密码'))
        } else if (value !== this.userInfo.confirmPassword1) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        fileList: [],
        sexOptions: [],
        show: false,
        rules2: {
          password: [{ validator: password, trigger: 'blur', required: true }],
          confirmPassword1: [{ validator: validateConfirmPassword1, trigger: 'blur', required: true }],
          confirmPassword2: [{ validator: validateConfirmPassword2, trigger: 'blur', required: true }]
        }
      }
    },
    created() {
      this.postDictionaryDetailsByCode(15, (data) => {
        this.sexOptions = data
      })
      this.userInfo.password = ''
      this.userInfo.confirmPassword1 = ''
      this.userInfo.confirmPassword2 = ''
    },
    computed: {
      ...mapGetters(['userInfo'])
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
              const userPassInfo = {
                id: this.userInfo.id,
                password: this.userInfo.password,
                confirmPassword1: this.userInfo.confirmPassword1,
                confirmPassword2: this.userInfo.confirmPassword2
              }
              changePassword(userPassInfo).then(response => {
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

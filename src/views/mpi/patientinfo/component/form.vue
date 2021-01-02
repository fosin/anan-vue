<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="850px">
    <el-row>
      <el-col :span="8" :push="16">
        <el-button round icon="el-icon-circle-close" @click="cancel('form')">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          v-if="dialogStatus==='create'"
          round
          type="primary"
          icon="el-icon-circle-check"
          autofocus
          @click="create('form')"
        >
          {{ $t('table.confirm') }}
        </el-button>
        <el-button v-else :disabled="dialogStatus==='view'" round type="primary" icon="el-icon-circle-check" autofocus @click="update('form')">
          {{ $t('table.update') }}
        </el-button>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" tab-position="top" @tab-click="tabClick">
      <el-tab-pane name="tabPanePatientinfo" label="基础信息">
        <el-form ref="form" :model="form" :rules="rules" :disabled="dialogStatus==='view'" label-width="80px" size="mini">
          <el-row>
            <el-col :span="6">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" placeholder="姓名" @blur="onFormKeyUp('name')" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="性别" prop="sex">
                <el-select v-model="form.sex" class="filter-item" placeholder="请选择性别">
                  <el-option v-for="item in sexOptions" :key="item.name" :label="item.value" :value="item.name" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="民族" prop="nation">
                <el-select v-model="form.nation" class="filter-item" placeholder="请选择民族">
                  <el-option v-for="item in nationOptions" :key="item.name" :label="item.value" :value="item.name" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" />
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="姓名简码" prop="pycode">
                <el-input v-model="form.pycode" placeholder="姓名简码" @blur="onFormKeyUp('pycode',$event)" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="卡号" prop="cardNo">
                <el-input v-model="form.cardNo" placeholder="卡号" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="国籍" prop="nationality">
                <el-select v-model="form.nationality" class="filter-item" placeholder="请选择国籍">
                  <el-option v-for="item in nationalityOptions" :key="item.name" :label="item.value" :value="item.name" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="身份证号" prop="idcard">
                <el-input v-model="form.idcard" placeholder="身份证号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生日" prop="birthday">
                <el-date-picker
                  v-model="form.birthday"
                  :picker-options="birthday"
                  align="right"
                  type="date"
                  placeholder="请选择用户生日"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" />
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="血型" prop="bloodtype">
                <el-select v-model="form.bloodtype" class="filter-item" placeholder="请选择血型">
                  <el-option v-for="item in bloodtypeOptions" :key="item.name" :label="item.value" :value="item.name" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="RH血型" prop="rhblood">
                <el-select v-model="form.rhblood" class="filter-item" placeholder="请选择RH血型">
                  <el-option v-for="item in rhbloodOptions" :key="item.name" :label="item.value" :value="item.name" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="婚姻状态" prop="marital">
                <el-select v-model="form.marital" class="filter-item" placeholder="请选择婚姻状态">
                  <el-option v-for="item in maritalOptions" :key="item.name" :label="item.value" :value="item.name" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否死亡" prop="death">
                <el-select v-model="form.death" class="filter-item" placeholder="请选择是否死亡">
                  <el-option v-for="item in deathOptions" :key="item.name" :label="item.value" :value="item.name" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="职业类别" prop="workType">
                <el-select v-model="form.workType" class="filter-item" placeholder="请选择职业类别">
                  <el-option v-for="item in workTypeOptions" :key="item.name" :label="item.value" :value="item.name" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="文化程度" prop="education">
                <el-select v-model="form.education" class="filter-item" placeholder="请选择文化程度">
                  <el-option v-for="item in educationOptions" :key="item.name" :label="item.value" :value="item.name" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="参保类型" prop="insurance">
                <el-select v-model="form.insurance" class="filter-item" placeholder="请选择参保类型">
                  <el-option v-for="item in insuranceOptions" :key="item.name" :label="item.value" :value="item.name" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="保险类型" prop="insurancetype">
                <el-select v-model="form.insurancetype" class="filter-item" placeholder="请选择保险类型">
                  <el-option v-for="item in insurancetypeOptions" :key="item.name" :label="item.value" :value="item.name" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="联系人身份证" prop="contactIdcard" label-width="100px">
                <el-input v-model="form.contactIdcard" placeholder="联系人身份证" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系人姓名" prop="contactName" label-width="100px">
                <el-input v-model="form.contactName" placeholder="联系人姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系人电话" prop="contactPhone" label-width="100px">
                <el-input v-model="form.contactPhone" placeholder="联系人电话" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="联系人信息" prop="contactInfo" label-width="100px">
                <el-input v-model="form.contactInfo" placeholder="联系人信息" />
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="籍贯" prop="native_place">
                <el-input v-model="form.native_place" placeholder="籍贯" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="参加工作时间" prop="workDate" label-width="100px">
                <el-date-picker
                  v-model="form.workDate"
                  :picker-options="workDate"
                  align="right"
                  type="date"
                  placeholder="请选择工作时间"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width:170px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="工作单位" prop="workplace">
                <el-input v-model="form.workplace" placeholder="工作单位" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="本人电话" prop="phone">
                <el-input v-model="form.phone" placeholder="本人电话" />
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="住址" prop="address">
                <el-input v-model="form.address" placeholder="住址" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="邮编" prop="postal">
                <el-input v-model="form.postal" placeholder="邮编" />
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="户口" prop="household">
                <el-input v-model="form.household" placeholder="户口" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane ref="tabCardinfo" :disabled="dialogStatus==='create'" name="tabPaneCardinfo" label="卡管理">
        <Cardinfo ref="formCardinfo" :mpi-id="mpiId" :disabled="dialogStatus==='view'" />
      </el-tab-pane>
      <el-tab-pane ref="tabCertificate" :disabled="dialogStatus==='create'" name="tabPaneCertificate" label="证件管理">
        <Certificate ref="formCertificate" :mpi-id="mpiId" :disabled="dialogStatus==='view'" />
      </el-tab-pane>
      <el-tab-pane ref="tabAddress" :disabled="dialogStatus==='create'" name="tabPaneAddress" label="地址管理">
        <Address ref="formAddress" :mpi-id="mpiId" :disabled="dialogStatus==='view'" />
      </el-tab-pane>
      <el-tab-pane ref="tabContactinfo" :disabled="dialogStatus==='create'" name="tabPaneContactinfo" label="联系人管理">
        <Contactinfo ref="formContactinfo" :mpi-id="mpiId" :disabled="dialogStatus==='view'" />
      </el-tab-pane>
      <el-tab-pane ref="tabOperationlog" :disabled="dialogStatus==='create'" name="tabPaneOperationlog" label="操作记录">
        <Operationlog ref="formOperationlog" :mpi-id="mpiId" :disabled="dialogStatus==='view'" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import { getPatientinfo, postPatientinfo, putPatientinfo, statusPatientinfo } from './patientinfo'

import Address from '../../address'
import Cardinfo from '../../cardinfo'
import Certificate from '../../certificate'
import Contactinfo from '../../contactinfo'
import Operationlog from '../../operationlog'
export default {
  name: 'MpiPatientinfoForm',

  components: {
    Address,
    Cardinfo,
    Certificate,
    Contactinfo,
    Operationlog
  },
  props: {
    mpiId: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      workDate: {
        disabledDate(time) {
          const dat = new Date('1900/01/01')
          return time.getTime() < dat.getTime()
        }
      },
      birthday: {
        disabledDate(time) {
          const dat = new Date('1900/01/01')
          return time.getTime() < dat.getTime()
        }
      },
      listLoading: true,
      activeName: 'tabPanePatientinfo',
      form: {},
      rules: {
        name: [
          {
            required: true,
            message: '请输入病人姓名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        pycode: [
          {
            pattern: /^[A-Za-z]+$/,
            message: '只能输入大小写字母'
          }
        ],
        cardNo: [
          {
            pattern: /^\d+$/,
            message: '只能输入数字卡号'
          }
        ],
        idcard: [
          {
            pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: '请输入正确身份证号'
          }
        ],
        contactIdcard: [
          {
            pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: '请输入正确身份证号'
          }
        ],
        contactPhone: [
          {
            pattern: /^(((\d{3}))|(\d{3}-))?13[0-9]\d{8}|15[89]\d{8}$/,
            message: '请输入正确电话号码'
          }
        ],
        phone: [
          {
            pattern: /^(((\d{3}))|(\d{3}-))?13[0-9]\d{8}|15[89]\d{8}$/,
            message: '请输入正确电话号码'
          }
        ],
        postal: [
          {
            pattern: /^\d{6}$/,
            message: '请输入正确的邮编'
          }
        ],
        sex: [
          {
            required: true,
            message: '请选择病人性别',
            trigger: 'blur'
          }
        ],
        birthday: [
          {
            required: true,
            message: '请选择病人出生年月',
            trigger: 'blur'
          }
        ],
        death: [
          {
            required: true,
            message: '请选择病人死亡状态',
            trigger: 'blur'
          }
        ]
      },
      sexOptions: [],
      nationOptions: [],
      nationalityOptions: [],
      bloodtypeOptions: [],
      rhbloodOptions: [],
      maritalOptions: [],
      educationOptions: [],
      insuranceOptions: [],
      insurancetypeOptions: [],
      workTypeOptions: [],
      deathOptions: [],
      infoFromOptions: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        view: '查看',
        update: '编辑',
        create: '创建'
      },
      addressRefresh: false,
      cardinfoRefresh: false,
      certificateRefresh: false,
      contactinfoRefresh: false,
      operationlogRefresh: false
    }
  },
  mounted() {
    /* this.loadDictionaryById(11).then(res => {
        this.statusOptions = res.details
      })*/
    this.loadDictionaryById(15).then(res => {
      this.sexOptions = res.details
    })
    this.loadDictionaryById(6).then(res => {
      this.nationOptions = res.details
    })
    this.loadDictionaryById(2).then(res => {
      this.nationalityOptions = res.details
    })
    this.loadDictionaryById(21).then(res => {
      this.bloodtypeOptions = res.details
    })
    this.loadDictionaryById(131).then(res => {
      this.rhbloodOptions = res.details
    })
    this.loadDictionaryById(5).then(res => {
      this.maritalOptions = res.details
    })
    this.loadDictionaryById(43).then(res => {
      this.educationOptions = res.details
    })
    this.loadDictionaryById(129).then(res => {
      this.insuranceOptions = res.details
    })
    this.loadDictionaryById(130).then(res => {
      this.insurancetypeOptions = res.details
    })
    this.loadDictionaryById(103).then(res => {
      this.workTypeOptions = res.details
    })
    this.loadDictionaryById(128).then(res => {
      this.deathOptions = res.details
    })
    this.loadDictionaryById(132).then(res => {
      this.infoFromOptions = res.details
    })
  },
  methods: {
    onFormKeyUp: function(type, val) {
      if (type === 'pycode') {
        // var reg = /^[a-zA-Z]+$/
        // if (!reg.test(val.target.value)) {}
      }
    },
    tabClick(tab, event) {
      if (!tab) {
        return
      }
      switch (tab.name) {
        case 'tabPaneCardinfo':
          if (!this.cardinfoRefresh) {
            this.$refs.formCardinfo.getList()
            this.cardinfoRefresh = true
          }
          break
        case 'tabPaneCertificate':
          if (!this.certificateRefresh) {
            this.$refs.formCertificate.getList()
            this.certificateRefresh = true
          }
          break
        case 'tabPaneAddress':
          if (!this.addressRefresh) {
            this.$refs.formAddress.getList()
            this.addressRefresh = true
          }
          break
        case 'tabPaneOperationlog':
          if (!this.operationlogRefresh) {
            this.$refs.formOperationlog.getList()
            this.operationlogRefresh = true
          }
          break
        case 'tabPaneContactinfo':
          if (!this.contactinfoRefresh) {
            this.$refs.formContactinfo.getList()
            this.contactinfoRefresh = true
          }
          break
        default:
      }
    },
    handleQuery() {
      if (!this.mpiId) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      this.resetForm()
      getPatientinfo(this.mpiId).then(response => {
        this.form = response.data
        this.dialogStatus = 'view'
        this.dialogFormVisible = true
        this.activeName = 'tabPanePatientinfo'
        return response
      }).catch(reason => {
        this.$notify({
          title: '获取失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
        return Promise.reject(reason)
      })
    },
    handleAdd() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.activeName = 'tabPanePatientinfo'
    },
    handleEdit() {
      if (!this.mpiId) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      this.resetForm()
      getPatientinfo(this.mpiId).then(response => {
        this.form = response.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
        return response
      }).catch(reason => {
        this.$notify({
          title: '获取失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
        return Promise.reject(reason)
      })
    },
    handleStatus(status) {
      if (!this.form || !this.mpiId) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      this.$confirm(
        status === 0 ? '此操作将恢复病人相关数据, 是否继续?' : '此操作将注销病人相关数据, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        statusPatientinfo(this.mpiId, status).then(response => {
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '操作成功!',
            type: 'success',
            duration: 2000
          })
          return response
        }).catch(reason => {
          this.$notify({
            title: '操作失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
          return Promise.reject(reason)
        })
      }).catch(reason => {
      })
    },
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          postPatientinfo(this.form).then((response) => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            return response
          }).catch(reason => {
            this.$notify({
              title: '新建失败',
              message: reason.message,
              type: 'error',
              duration: 5000
            })
            return Promise.reject(reason)
          })
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      this.dialogFormVisible = false
      if (formName === 'form') {
        this.$refs['form'].resetFields()
      }
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          putPatientinfo(this.form).then((response) => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            return response
          }).catch(reason => {
            this.$notify({
              title: '更新信息失败',
              message: reason.message,
              type: 'error',
              duration: 5000
            })
            return Promise.reject(reason)
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.form = {
        sex: 1,
        death: 0,
        nation: 1,
        nationality: 1,
        marital: 2,
        status: 0,
        bloodtype: 5,
        infoFrom: 0,
        updatesign: 0
      }
      this.addressRefresh = false
      this.cardinfoRefresh = false
      this.certificateRefresh = false
      this.contactinfoRefresh = false
      this.operationlogRefresh = false
      if (this.$refs.formCardinfo) {
        this.$refs.formCardinfo.resetForm()
      }
      if (this.$refs.formAddress) {
        this.$refs.formAddress.resetForm()
      }
      if (this.$refs.formCertificte) {
        this.$refs.formCertificte.resetForm()
      }
      if (this.$refs.formConcatinfo) {
        this.$refs.formConcatinfo.resetForm()
      }
      if (this.$refs.formOperationlog) {
        this.$refs.formOperationlog.resetForm()
      }
    }
  }
}
</script>

<style scoped>
  .el-select {
    width: 100%;
  }
  .el-date-picker {
    width:170px;
  }
</style>

<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="90%">
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
          {{ $t('table.merge') }}
        </el-button>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" tab-position="top">
      <el-tab-pane name="tabPanePatientinfo" label="基础信息">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="mini">
          <el-row>
            <el-col :span="6">
              <SingleEdit ref="singleEdit" :mpi-id="mpiId" :col-data="colData" :data="form" @listonForUpdateForm="listonForUpdateForm" />
            </el-col>
            <el-col :span="6">
              <SingleCol v-if="mpiId11" ref="singleCol2" :mpi-id="this.$props.mpiId11" :data="colData" @callMe="listenToSon" />
            </el-col>
            <el-col :span="6">
              <SingleCol v-if="mpiId22" ref="singleCol3" :mpi-id="this.$props.mpiId22" :data="colData" @callMe="listenToSon" />
            </el-col>
            <el-col :span="6">
              <SingleCol v-if="mpiId33" ref="singleCol4" :mpi-id="this.$props.mpiId33" :data="colData" @callMe="listenToSon" />
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
    </el-tabs>
  </el-dialog>
</template>
<script>
import SingleCol from './singleCol'
import SingleEdit from './singleEdit'
import { getPatientinfo, postPatientinfo, putPatientinfo, statusPatientinfo, cancelPatients } from './patientinfo'

import Address from '../../address'
import Cardinfo from '../../cardinfo'
import Certificate from '../../certificate'
import Contactinfo from '../../contactinfo'
export default {
  name: 'MpiPatientinfoMerge1',

  components: {
    SingleCol,
    SingleEdit,
    Address,
    Cardinfo,
    Certificate,
    Contactinfo
  },
  props: {
    mpiId: {
      type: Number,
      default: undefined
    },
    mpiId11: {
      type: String,
      default: undefined
    },
    mpiId22: {
      type: String,
      default: undefined
    },
    mpiId33: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      listLoading: true,
      activeName: 'tabPanePatientinfo',
      form: {},
      colData: {},
      mpiLists: [],
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
        create: '创建',
        merge: '合并'
      },
      addressRefresh: false,
      cardinfoRefresh: false,
      certificateRefresh: false,
      contactinfoRefresh: false,
      operationlogRefresh: false
    }
  },
  mounted() {
    /* this.asyncLoadDictionaryByCode(11, (data) => {
        this.statusOptions = data
      })*/
    this.asyncLoadDictionaryByCode(15, (data) => {
      this.sexOptions = data
    })
    this.asyncLoadDictionaryByCode(6, (data) => {
      this.nationOptions = data
    })
    this.asyncLoadDictionaryByCode(2, (data) => {
      this.nationalityOptions = data
    })
    this.asyncLoadDictionaryByCode(21, (data) => {
      this.bloodtypeOptions = data
    })
    this.asyncLoadDictionaryByCode(131, (data) => {
      this.rhbloodOptions = data
    })
    this.asyncLoadDictionaryByCode(5, (data) => {
      this.maritalOptions = data
    })
    this.asyncLoadDictionaryByCode(43, (data) => {
      this.educationOptions = data
    })
    this.asyncLoadDictionaryByCode(129, (data) => {
      this.insuranceOptions = data
    })
    this.asyncLoadDictionaryByCode(130, (data) => {
      this.insurancetypeOptions = data
    })
    this.asyncLoadDictionaryByCode(103, (data) => {
      this.workTypeOptions = data
    })
    this.asyncLoadDictionaryByCode(128, (data) => {
      this.deathOptions = data
    })
    this.asyncLoadDictionaryByCode(132, (data) => {
      this.infoFromOptions = data
    })
  },
  methods: {
    listonForUpdateForm: function(form) {
      this.form = form
      // alert('click me' + form.name)
    },
    listenToSon: function(colData) {
      this.colData = colData
      this.$refs.singleEdit.updateCell()
      // alert('funck')
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
    refreshList() {
      if (this.$refs.singleEdit) {
        this.$refs.singleEdit.getPatientinfoFirst()
      }
      if (this.$refs.singleCol2) {
        this.$refs.singleCol2.handleQuery()
      }
      if (this.$refs.singleCol3) {
        this.$refs.singleCol3.handleQuery()
      }
      if (this.$refs.singleCol4) {
        this.$refs.singleCol4.handleQuery()
      }
    },
    handleQuery() {
      if (!this.mpiId) {
        this.$message({
          message: '操作前请先选择一条数据!'
        })
        return
      }
      this.refreshList()
      getPatientinfo(this.mpiId).then(response => {
        this.form = response.data
        this.dialogStatus = 'merge'
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
          message: '操作前请先选择一行数据，作为合并主项!'
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
              message: '合并成功',
              type: 'success',
              duration: 2000
            })
            return response
          }).catch(reason => {
            this.$notify({
              title: '合并成功',
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
        // this.$refs.singleCol2.cancel()
      }
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          putPatientinfo(this.form).then((response) => {
            // this.dialogFormVisible = false
            return response
          }).catch(reason => {
            // return Promise.reject(reason)
          })
        } else {
          return false
        }
      })
      if (this.mpiId11 && this.mpiId11 !== this.form.mpiId) {
        this.mpiLists.push(this.mpiId11)
      }
      if (this.mpiId22 && this.mpiId22 !== this.form.mpiId) {
        this.mpiLists.push(this.mpiId22)
      }
      if (this.mpiId33 && this.mpiId33 !== this.form.mpiId) {
        this.mpiLists.push(this.mpiId33)
      }
      set[formName].validate(valid => {
        if (valid) {
          cancelPatients(this.mpiLists).then((response) => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '患者信息合并成功',
              type: 'success',
              duration: 2000
            })
            return response
          }).catch(reason => {
            this.$notify({
              title: '患者信息合并失败',
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
      this.$emit('handleRefreshList', null)
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
      if (this.$refs.singleEdit) {
        this.$refs.singleEdit.resetForm()
      }
      if (this.$refs.singleCol2) {
        this.$refs.singleCol2.resetForm()
      }
      if (this.$refs.singleCol3) {
        this.$refs.singleCol3.resetForm()
      }
      if (this.$refs.singleCol4) {
        this.$refs.singleCol4.resetForm()
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
    width: 100%;
  }
</style>

<template>
  <el-tabs v-model="activeName" tab-position="top" @tab-click="tabClick">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="mini">
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="name">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('name',form.name)">{{ form.name }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="sex">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('sex',form.sex)">{{ getAnanDicValue(sexOptions, form.sex) }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="nation">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('nation',form.nation)">{{ getAnanDicValue(nationOptions, form.nation) }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="20" />
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="pycode">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('pycode', form.pycode)">{{ form.pycode }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="cardNo">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('cardNo',form.cardNo)">{{ form.cardNo }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="nationality">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('nationality',form.nationality)">{{ getAnanDicValue(nationalityOptions, form.nationality) }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="idcard">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('idcard',form.idcard)">{{ form.idcard }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="birthday">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('birthday',form.birthday)">{{ form.birthday }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="bloodtype">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('bloodtype',form.bloodtype)">{{ getAnanDicValue(bloodtypeOptions, form.bloodtype) }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="rhblood">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('rhblood',form.rhblood)">{{ getAnanDicValue(rhbloodOptions, form.rhblood) }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="marital">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('marital',form.marital)">{{ getAnanDicValue(maritalOptions, form.marital) }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="death">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('death',form.death)">{{ getAnanDicValue(deathOptions, form.death) }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="workType">
            <span @click="handleItemClick('workType',form.workType)">{{ getAnanDicValue(workTypeOptions, form.workType) }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="education">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('education',form.education)">{{ getAnanDicValue(educationOptions, form.education) }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="insurance">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('insurance',form.insurance)">{{ form.insurance === null?'':getAnanDicValue(insuranceOptions, form.insurance) }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="insurancetype">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('insurancetype',form.insurancetype)">'{{ form.insurancetype === null?'':getAnanDicValue(insurancetypeOptions, form.insurancetype) }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="contactIdcard">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('contactIdcard',form.contactIdcard)">{{ form.contactIdcard }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="contactName">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('contactName',form.contactName)">{{ form.contactName }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="contactPhone">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('contactPhone',form.contactPhone)">{{ form.contactPhoneo===null?'':form.contactPhoneo }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="contactInfo">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('contactInfo',form.contactInfo)">{{ form.contactInfo===null?'':form.contactInfo }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="native_place">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('native_place',form.native_place)">{{ form.native_place===null?'22':form.native_place }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="" prop="workDate">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('workDate',form.workDate)">{{ form.workDate===null?'':form.workDate }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="workplace">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('workplace',form.workplace)">{{ form.workplace===null?'':form.workplace }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="phone">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('phone',form.phone)">{{ form.phone===null?'':form.phone }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="address">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('address',form.address)">{{ form.address===null?'':form.address }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="postal">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('postal',form.postal)">{{ form.postal===null?'':form.postal }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="" prop="household">
            <el-tooltip class="item" effect="dark" content="双击合并" placement="top-start">
              <span @click="handleItemClick('household',form.household)">{{ form.household===null?'':form.household }}</span>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-tabs>
</template>
<script>
import { getPatientinfo, postPatientinfo, putPatientinfo, statusPatientinfo } from './patientinfo'

export default {
  name: 'Mpi11patientinfoForm',
  components: {
  },
  props: {
    mpiId: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      listLoading: false,
      activeName: 'tabPanePatientinfo',
      form: {},
      colData: {},
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
      dialogFormVisible: true,
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
    this.handleQuery()
  },
  methods: {
    handleItemClick: function(Name, Val) {
      if (Val) {
        this.colData.colName = Name
        this.colData.colVal = Val
        this.$emit('callMe', this.colData)
      }
    },
    tabClick(tab, event) {
      if (!tab) {
        return
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
    cancel() {
      // this.dialogFormVisible = false
      this.$refs['form'].resetFields()
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
  .el-row {
    height:50px;
    padding-top:8px;
    border:#ddd 1px solid;
  }
  .el-date-picker {
    width: 100%;
  }
</style>

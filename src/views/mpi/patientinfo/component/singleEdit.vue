<template>

  <el-tabs v-model="activeName" tab-position="top" @tab-click="tabClick">

    <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="mini">
      <el-row >
        <el-col :span="20">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="姓名"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="性别" prop="sex">
            <el-select v-model="form.sex" class="filter-item" placeholder="请选择性别">
              <el-option
                v-for="item in sexOptions"
                :key="item.name"
                :label="item.value"
                :value="item.name"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="民族" prop="nation">
            <el-select v-model="form.nation" class="filter-item" placeholder="请选择民族">
              <el-option
                v-for="item in nationOptions"
                :key="item.name"
                :label="item.value"
                :value="item.name"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="20"/>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="姓名简码" prop="pycode">
            <el-input v-model="form.pycode" placeholder="姓名简码"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="卡号" prop="cardNo">
            <el-input v-model="form.cardNo" placeholder="卡号"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="国籍" prop="nationality">
            <el-select v-model="form.nationality" class="filter-item" placeholder="请选择国籍">
              <el-option
                v-for="item in nationalityOptions"
                :key="item.name"
                :label="item.value"
                :value="item.name"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="身份证号" prop="idcard">
            <el-input v-model="form.idcard" placeholder="身份证号"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="生日" prop="birthday">
            <el-date-picker
              v-model="form.birthday"
              align="right"
              type="date"
              placeholder="请选择用户生日"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width:190px"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row >
        <el-col :span="20">
          <el-form-item label="血型" prop="bloodtype">
            <el-select v-model="form.bloodtype" class="filter-item" placeholder="请选择血型">
              <el-option
                v-for="item in bloodtypeOptions"
                :key="item.name"
                :label="item.value"
                :value="item.name"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="RH血型" prop="rhblood">
            <el-select v-model="form.rhblood" class="filter-item" placeholder="请选择RH血型">
              <el-option
                v-for="item in rhbloodOptions"
                :key="item.name"
                :label="item.value"
                :value="item.name"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="婚姻状态" prop="marital">
            <el-select v-model="form.marital" class="filter-item" placeholder="请选择婚姻状态">
              <el-option
                v-for="item in maritalOptions"
                :key="item.name"
                :label="item.value"
                :value="item.name"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="是否死亡" prop="death">
            <el-select v-model="form.death" class="filter-item" placeholder="请选择是否死亡">
              <el-option
                v-for="item in deathOptions"
                :key="item.name"
                :label="item.value"
                :value="item.name"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="职业类别" prop="workType">
            <el-select v-model="form.workType" class="filter-item" placeholder="请选择职业类别">
              <el-option
                v-for="item in workTypeOptions"
                :key="item.name"
                :label="item.value"
                :value="item.name"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="文化程度" prop="education">
            <el-select v-model="form.education" class="filter-item" placeholder="请选择文化程度">
              <el-option
                v-for="item in educationOptions"
                :key="item.name"
                :label="item.value"
                :value="item.name"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="参保类型" prop="insurance">
            <el-select v-model="form.insurance" class="filter-item" placeholder="请选择参保类型">
              <el-option
                v-for="item in insuranceOptions"
                :key="item.name"
                :label="item.value"
                :value="item.name"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="保险类型" prop="insurancetype">
            <el-select v-model="form.insurancetype" class="filter-item" placeholder="请选择保险类型">
              <el-option
                v-for="item in insurancetypeOptions"
                :key="item.name"
                :label="item.value"
                :value="item.name"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="联系人身份证" prop="contactIdcard" label-width="100px">
            <el-input v-model="form.contactIdcard" placeholder="联系人身份证"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="联系人姓名" prop="contactName" label-width="100px">
            <el-input v-model="form.contactName" placeholder="联系人姓名"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="联系人电话" prop="contactPhone" label-width="100px">
            <el-input v-model="form.contactPhone" placeholder="联系人电话"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="联系人信息" prop="contactInfo" label-width="100px">
            <el-input v-model="form.contactInfo" placeholder="联系人信息"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="籍贯" prop="native_place">
            <el-input v-model="form.native_place" placeholder="籍贯"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="24">
          <el-form-item label="参加工作时间" prop="workDate" label-width="100px">
            <el-date-picker
              v-model="form.workDate"
              align="right"
              type="date"
              placeholder="请选择工作时间"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width:190px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="工作单位" prop="workplace">
            <el-input v-model="form.workplace" placeholder="工作单位"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="本人电话" prop="phone">
            <el-input v-model="form.phone" placeholder="本人电话"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="住址" prop="address">
            <el-input v-model="form.address" placeholder="住址"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="邮编" prop="postal">
            <el-input v-model="form.postal" placeholder="邮编"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="20">
          <el-form-item label="户口" prop="household">
            <el-input v-model="form.household" placeholder="户口"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </el-tabs>

</template>
<script>
import { getPatientinfo, postPatientinfo, putPatientinfo, statusPatientinfo } from './patientinfo'

import Address from '../../address'
import Cardinfo from '../../cardinfo'
import Certificate from '../../certificate'
import Contactinfo from '../../contactinfo'
import Operationlog from '../../operationlog'

export default {
  name: 'SingleEdit',

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
    },
    colData: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      listLoading: true,
      activeName: 'singleEdit',
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
    this.getPatientinfoFirst()
  },
  methods: {
    updateCell() {
      if (this.colData.colName === 'name') {
        this.form.name = this.colData.colVal
      }
      if (this.colData.colName === 'sex') {
        this.form.sex = this.colData.colVal
      }
      if (this.colData.colName === 'nation') {
        this.form.nation = this.colData.colVal
      }
      if (this.colData.colName === 'pycode') {
        this.form.pycode = this.colData.colVal
      }
      if (this.colData.colName === 'cardNo') {
        this.form.cardNo = this.colData.colVal
      }
      if (this.colData.colName === 'nationality') {
        this.form.nationality = this.colData.colVal
      }
      if (this.colData.colName === 'idcard') {
        this.form.idcard = this.colData.colVal
      }
      if (this.colData.colName === 'birthday') {
        this.form.birthday = this.colData.colVal
      }
      if (this.colData.colName === 'bloodtype') {
        this.form.bloodtype = this.colData.colVal
      }
      if (this.colData.colName === 'rhblood') {
        this.form.rhblood = this.colData.colVal
      }
      if (this.colData.colName === 'marital') {
        this.form.marital = this.colData.colVal
      }
      if (this.colData.colName === 'death') {
        this.form.death = this.colData.colVal
      }
      if (this.colData.colName === 'workType') {
        this.form.workType = this.colData.colVal
      }
      if (this.colData.colName === 'education') {
        this.form.education = this.colData.colVal
      }
      if (this.colData.colName === 'insurancet') {
        this.form.insurancet = this.colData.colVal
      }
      if (this.colData.colName === 'insurancetype') {
        this.form.insurancetype = this.colData.colVal
      }
      if (this.colData.colName === 'contactIdcard') {
        this.form.contactIdcard = this.colData.colVal
      }
      if (this.colData.colName === 'contactName') {
        this.form.contactName = this.colData.colVal
      }
      if (this.colData.colName === 'contactPhone') {
        this.form.contactPhone = this.colData.colVal
      }
      if (this.colData.colName === 'contactInfo') {
        this.form.contactInfo = this.colData.colVal
      }
      if (this.colData.colName === 'native_place') {
        this.form.native_place = this.colData.colVal
      }
      if (this.colData.colName === 'workDate') {
        this.form.workDate = this.colData.colVal
      }
      if (this.colData.colName === 'workplace') {
        this.form.workplace = this.colData.colVal
      }
      if (this.colData.colName === 'phone') {
        this.form.phone = this.colData.colVal
      }
      if (this.colData.colName === 'address') {
        this.form.address = this.colData.colVal
      }
      if (this.colData.colName === 'postal') {
        this.form.postal = this.colData.colVal
      }
      if (this.colData.colName === 'household') {
        this.form.household = this.colData.colVal
      }
      this.$emit('listonForUpdateForm', this.form)
    },
    tabClick(tab, event) {
      if (!tab) {
        return
      }
    },
    getPatientinfoFirst() {
      if (!this.mpiId) {
        this.$message({
          message: '操作前请先选择一条数据!!'
        })
        return
      }
      this.resetForm()
      getPatientinfo(this.mpiId).then(response => {
        this.form = response.data
        this.dialogStatus = 'view'
        this.dialogFormVisible = true
        this.activeName = 'singleEdit'
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
      this.activeName = 'singleEdit'
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
  .el-row {
    height:50px;
    owerflow:hiden;
    padding-top:8px;
    border:solid 1px #d0d0d0;
  }
  .el-date-picker {
    width: 100%;
  }
</style>

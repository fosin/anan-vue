<template>
  <div class="app-container" :style="dynamicStyle">
    <h2 class="text-center">{{ paperData.title }}(阅卷)</h2>
    <p class="text-center" style="color: #666">{{ paperData.createTime }}</p>
    <el-row :gutter="24" style="margin-top: 50px">
      <el-col :span="4" class="text-center">
        考生姓名：{{ userInfo.username }}
      </el-col>
      <el-col :span="8" class="text-center">
        得分：{{ paperData.userScore }} = {{ paperData.objScore }}(客观) + {{ paperData.subjScore }}(主观)
      </el-col>
      <el-col :span="4" class="text-center">
        合格分/总分：{{ paperData.qualifyScore }} / {{ paperData.totalScore }}
      </el-col>
      <el-col :span="4" class="text-center">
        考试用时：{{ paperData.userTime }}分钟
      </el-col>
      <el-col :span="4" class="text-center">
        <el-button
          type="primary"
          icon="el-icon-check"
          :loading="loading"
          @click="reviewResult()"
        >
          提交阅卷
        </el-button>
      </el-col>
    </el-row>
    <el-card style="margin-top: 20px">
      <div v-if="!hideObj">
        <div v-for="item in paperData.quList" :key="item.id" class="qu-content">
          <div v-if="item.quType === 1 || item.quType===3">
            <el-row>
              <el-col :span="1">
                <el-tag v-if="item.isRight" type="success">对,{{ item.actualScore }}分</el-tag>
                <div v-else>
                  <el-tag v-if="item.actualScore > 0" type="warning">得,{{ item.actualScore }}分</el-tag>
                  <el-tag v-else type="danger">错,{{ item.actualScore }}分</el-tag>
                </div>
              </el-col>
              <el-col :span="23">
                <el-input v-model="item.quTitle" autosize type="textarea" readonly resize="none" style="margin-bottom: 20px;border: 0" />
              </el-col>
            </el-row>
            <el-radio-group v-model="radioValues[item.id]">
              <el-radio v-for="an in item.answerList" :key="an.id" :label="an.id">
                {{ an.abc }}.  【{{ an.content }}】
              </el-radio>
            </el-radio-group>
            <el-row>
              <el-col :span="4" style="color: #24da70">
                正确答案：{{ radioRights[item.id] }}
              </el-col>
              <el-col :span="3">
                <el-switch
                  v-model="item.isRight"
                  style="display: block"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="判对"
                  inactive-text="判错"
                />
              </el-col>
              <el-col v-if="item.isRight" :span="6">
                老师评分：<el-input-number v-model="item.actualScore" :min="0" :max="item.score" style="width: 40%" :disabled="!item.isRight" />共{{ item.score }}分
              </el-col>
            </el-row>
          </div>
          <div v-if="item.quType === 2">
            <el-row>
              <el-col :span="1">
                <el-tag v-if="item.isRight" type="success">对,{{ item.actualScore }}分</el-tag>
                <div v-else>
                  <el-tag v-if="item.actualScore > 0" type="warning">得,{{ item.actualScore }}分</el-tag>
                  <el-tag v-else type="danger">错,{{ item.actualScore }}分</el-tag>
                </div>
              </el-col>
              <el-col :span="23">
                <el-input v-model="item.quTitle" autosize type="textarea" readonly resize="none" style="margin-bottom: 20px;border: 0" />
              </el-col>
            </el-row>
            <el-checkbox-group v-model="multiValues[item.id]">
              <el-checkbox v-for="an in item.answerList" :key="an.id" :label="an.id">{{ an.abc }}.  【{{ an.content }}】</el-checkbox>
            </el-checkbox-group>
            <el-row>
              <el-col :span="4" style="color: #24da70">
                正确答案：{{ multiRights[item.id].join(',') }}
              </el-col>
              <el-col :span="3">
                <el-switch
                  v-model="item.isRight"
                  style="display: block"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="判对"
                  inactive-text="判错"
                />
              </el-col>
              <el-col v-if="item.isRight" :span="6">
                老师评分：<el-input-number v-model="item.actualScore" :min="0" :max="item.score" style="width: 40%" :disabled="!item.isRight" />共{{ item.score }}分
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div v-if="paperData.hasSaq">
        <el-divider v-if="hideObj">
          <el-button type="primary" @click="showAllQu"><i class="el-icon-arrow-down" /><i class="el-icon-arrow-down" /><i class="el-icon-arrow-down" />显示客观题<i class="el-icon-arrow-down" /><i class="el-icon-arrow-down" /><i class="el-icon-arrow-down" /></el-button>
        </el-divider>
        <el-divider v-else>
          <el-button type="primary" @click="showAllQu"><i class="el-icon-arrow-up" /><i class="el-icon-arrow-up" /><i class="el-icon-arrow-up" />隐藏客观题<i class="el-icon-arrow-up" /><i class="el-icon-arrow-up" /><i class="el-icon-arrow-up" /></el-button>
        </el-divider>
      </div>
      <div v-for="item in saqList" :key="item.id" class="qu-content">
        <div v-if="item.quType === 4">
          <el-row>
            <el-col :span="1">
              <div v-if="item.isRight">
                <el-tag v-if="item.actualScore > 0" type="success">对,{{ item.actualScore }}分</el-tag>
                <el-tag v-else type="danger">错,{{ item.actualScore }}分</el-tag>
              </div>
              <el-tag v-else type="warning">待阅卷</el-tag>
            </el-col>
            <el-col :span="23">
              <el-input v-model="item.quTitle" autosize type="textarea" readonly resize="none" style="margin-bottom: 20px;border: 0" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              考生回答：
              <el-input v-model="item.answer" autosize type="textarea" readonly resize="none" style="margin-bottom: 10px;border: 0" />
            </el-col>
            <el-col :span="24">
              参考答案：
              <el-input v-model="item.analysis" autosize type="textarea" readonly resize="none" style="margin-bottom: 10px;border: 0" />
            </el-col>
            <el-col :span="3">
              <el-switch
                v-model="item.isRight"
                style="display: block"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="判对"
                inactive-text="判错"
              />
            </el-col>
            <el-col v-if="item.isRight" :span="6">
              老师评分：<el-input-number v-model="item.actualScore" :min="0" :max="item.score" style="width: 40%" :disabled="!item.isRight" />共{{ item.score }}分
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>

import { paperResult } from '@/views/exam/paper/exam/exam'
import { getUser } from '@/views/platform/user/user'
import { controlCopy } from '@/utils/documentUtil'
import { reviewPaper } from '@/views/exam/paper/paper/paper'

export default {
  name: 'ExamManagementReviewPaper',
  data() {
    return {
      // 试卷ID
      dynamicStyle: {},
      paperId: '',
      loading: false,
      hideObj: true,
      paperData: {
        quList: []
      },
      userInfo: {},
      radioValues: {},
      multiValues: {},
      radioRights: {},
      multiRights: {},
      myRadio: {},
      myMulti: {}
    }
  },
  computed: {
    saqList() {
      return this.paperData.quList.filter(qu => qu.quType === 4)
    }
  },
  watch: {
    // 检测查询变化
    'paperData.quList': {
      handler(quList) {
        if (!quList || quList.length < 1) {
          return
        }
        let objScore = 0
        let subjScore = 0
        quList.forEach(qu => {
          if (qu.quType === 4) {
            subjScore += qu.actualScore ? qu.actualScore : 0
          } else {
            objScore += qu.actualScore ? qu.actualScore : 0
          }
        })
        this.paperData.objScore = objScore
        this.paperData.subjScore = subjScore
        this.paperData.userScore = objScore + subjScore
      },
      deep: true
    }
  },
  created() {
    const paperId = this.$route.params.paperId
    if (typeof paperId !== 'undefined') {
      this.paperId = paperId
      this.fetchData(paperId)
    }
  },
  beforeDestroy() {
    if (!this.paperData.paperCopy) {
      controlCopy(false)
    }
  },
  methods: {
    showAllQu() {
      this.hideObj = !this.hideObj
    },
    reviewResult() {
      this.$confirm('确认要提交阅卷结果吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        reviewPaper(this.paperData).then(response => {
          this.loading = false
          this.$message({
            message: '提交阅卷完成！',
            type: 'success'
          })
          this.$store.dispatch('closeAndPushToView', { name: 'ExamManagementReview' })
        }).catch((reason) => {
          this.loading = false
          this.$notify({
            title: '提交阅卷结果失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      })
    },
    fetchData(id) {
      const params = { id: id }
      paperResult(params).then(response => {
        // 试卷内容
        this.paperData = response.data
        getUser(this.paperData.userId).then(res => {
          this.userInfo = res.data
        })
        // 禁止复制试卷内容
        if (!this.paperData.paperCopy) {
          this.dynamicStyle = {
            '@media print': {
              body: { display: 'none' }
            }
          }
          controlCopy(true)
        }
        // 填充该题目的答案
        this.paperData.quList.forEach((item) => {
          let radioValue = ''
          let radioRight = ''
          let myRadio = ''
          const multiValue = []
          const multiRight = []
          const myMulti = []
          item.quTitle = (item.sort + 1) + '、' + item.content
          item.answerList.forEach((an) => {
            // 用户选定的
            if (an.checked) {
              if (item.quType === 1 || item.quType === 3) {
                radioValue = an.id
                myRadio = an.abc
              } else {
                multiValue.push(an.id)
                myMulti.push(an.abc)
              }
            }

            // 正确答案
            if (an.isRight) {
              if (item.quType === 1 || item.quType === 3) {
                radioRight = an.abc
              } else {
                multiRight.push(an.abc)
              }
            }
          })

          this.multiValues[item.id] = multiValue
          this.radioValues[item.id] = radioValue

          this.radioRights[item.id] = radioRight
          this.multiRights[item.id] = multiRight

          this.myRadio[item.id] = myRadio
          this.myMulti[item.id] = myMulti

          this.hideObj = this.paperData.hasSaq
        })
      }).catch((reason) => {
        this.$notify({
          title: '获取考试结果失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    }
  }
}
</script>

<style scoped>

  .qu-content{

    border-bottom: #eee 1px solid;
    padding-bottom: 10px;

  }

  .qu-content div{
    line-height: 30px;
  }

  .el-checkbox-group label,.el-radio-group label{
    width: 100%;
  }

  .card-title{
    background: #eee;
    line-height: 35px;
    text-align: center;
    font-size: 14px;
  }
  .card-line{
    padding-left: 10px
  }
  .card-line span {
    cursor: pointer;
    margin: 2px;
  }
</style>


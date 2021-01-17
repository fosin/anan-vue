<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="24" style="margin-bottom: 20px">
        <el-alert
          title="点击`开始考试`后将自动进入考试，请诚信考试！"
          type="info"
          effect="dark"
          :closable="false"
          show-icon
          style="margin-bottom: 10px;font-size: 24px;font-weight: bold;"
        />
        <el-alert
          v-if="detailData.showCamera"
          title="警告：本次考试会自动开启摄像头，考试过程中出现非本人或本人离场，可能会被判定考试无效!"
          type="warning"
          effect="dark"
          :closable="false"
          show-icon
          style="margin-bottom: 10px;font-size: 24px;font-weight: bold;"
        />
        <el-alert
          v-if="detailData.ssCount > 0"
          :title="ssCountAlert"
          type="warning"
          effect="dark"
          :closable="false"
          show-icon
          style="margin-bottom: 10px;font-size: 24px;font-weight: bold;"
        />
        <el-alert
          v-if="!detailData.paperCopy"
          title="警告：未经允许不得擅自复制考题，更不允许向外泄题!"
          type="warning"
          effect="dark"
          :closable="false"
          show-icon
          style="margin-bottom: 10px;font-size: 24px;font-weight: bold;"
        />
        <el-card class="pre-exam">
          <div><strong>考试名称：</strong>{{ detailData.title }}</div>
          <div><strong>考试时长：</strong>{{ detailData.totalTime }}分钟</div>
          <div><strong>试卷总分：</strong>{{ detailData.totalScore }}分</div>
          <div><strong>及格分数：</strong>{{ detailData.qualifyScore }}分</div>
          <div><strong>考试描述：</strong>{{ detailData.content }}</div>
          <div><strong>开放类型：</strong> {{ getDicDetailValue(openTypes, detailData.openType) }}</div>
          <div v-if="detailData.allowTimes > 0"><strong>当前次数/总考试次数：</strong>{{ tryCount }}/{{ detailData.allowTimes }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-button
          v-if="((detailData.allowTimes > 0 && detailData.allowTimes >= tryCount) || detailData.allowTimes < 1)"
          type="primary"
          icon="el-icon-caret-right"
          @click="handleCreate"
        >
          开始考试
        </el-button>
        <el-button @click="handleBack">
          返回
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
import { fetchDetail } from '../../exam/exam'
import { createPaper } from './exam'

export default {
  name: 'ExamOnlineDoPrepare',
  data() {
    return {
      detailData: {},
      userExam: {},
      tryCount: 1,
      ssCountAlert: '警告：本次考试切屏超过次后，系统将自动交卷！',
      postForm: {
        examId: '',
        password: ''
      },
      openTypes: [],
      rules: {
        password: [
          { required: true, message: '考试密码不能为空！' }
        ]
      }
    }
  },
  created() {
    this.postForm.examId = this.$route.params.examId
    this.fetchData()
    this.loadDictionaryById(144).then(res => {
      this.openTypes = res.details
    })
  },
  methods: {
    fetchData() {
      fetchDetail(this.postForm.examId).then(response => {
        this.detailData = response.data
        this.ssCountAlert = '警告：本次考试切屏超过' + this.detailData.ssCount + '次后，系统将自动交卷！'
        if (this.detailData.allowTimes > 0) {
          this.postRequest('gateway/exam/api/user/exam/detail/' + this.postForm.examId).then(response => {
            if (response.data) {
              this.userExam = response.data
              if (this.userExam.tryCount) {
                this.tryCount = this.userExam.tryCount + 1
              } else {
                this.tryCount = 1
              }
            }
          })
        }
      })
    },
    handleCreate() {
      const that = this
      // 打开
      const loading = Loading.service({
        text: '正在努力创建试卷...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      createPaper(this.postForm).then(response => {
        const data = response.data
        this.$message({
          message: '试卷创建成功，即将进入考试！',
          type: 'success'
        })
        setTimeout(function() {
          loading.close()
          that.dialogVisible = false
          that.$router.push({ name: 'ExamOnlineDoExam', params: { id: data.id }})
        }, 1000)
      }).catch(() => {
        loading.close()
      })
    },
    handleBack() {
      this.$store.dispatch('closeAndPushToView', { name: 'ExamOnlineDo' })
    }
  }
}
</script>

<style scoped>

.pre-exam div {

  line-height: 42px;
  color: #555555;
}

</style>


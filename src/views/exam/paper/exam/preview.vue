<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="12">
        <el-alert
          title="点击`开始考试`后将自动进入考试，请诚信考试！"
          type="info"
          effect="dark"
          :closable="false"
          show-icon
          style="margin-bottom: 10px;font-size: 24px;font-weight: bold;"
        />
      </el-col>
      <el-col :span="12">
        <el-alert
          v-if="!detailData.paperCopy"
          title="注意：未经允许不得擅自复制考题，更不允许向外泄题!"
          type="warning"
          effect="dark"
          :closable="false"
          show-icon
          style="margin-bottom: 10px;font-size: 24px;font-weight: bold;"
        />
      </el-col>
      <el-col :span="24">
        <el-alert
          v-if="detailData.photoFrequency > 0"
          title="注意：本次考试会自动开启摄像头(注意放行浏览器权限)，考试过程中请保持周边无其他人，否则可能会被判定考试无效!"
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
      </el-col>

      <el-col :span="24">
        <el-card class="pre-exam">
          <el-row>
            <el-col :span="16">
              <div><strong>考试名称：</strong>{{ detailData.title }}</div>
              <div><strong>考试时长：</strong>{{ detailData.totalTime }}分钟</div>
              <div><strong>试卷总分：</strong>{{ detailData.totalScore }}分</div>
              <div><strong>合格分数：</strong>{{ detailData.qualifyScore }}分</div>
              <div><strong>考试描述：</strong>{{ detailData.content }}</div>
              <div><strong>开放类型：</strong> {{ getDicDetailValue(openTypes, detailData.openType) }}</div>
              <div v-if="detailData.allowTimes > 0"><strong>当前次数/总考试次数：</strong>{{ tryCount }}/{{ detailData.allowTimes }}
              </div>
            </el-col>
            <el-col :span="8">
              <video ref="videoCamera" :width="videoWidth" :height="videoHeight" autoplay style="float: right" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="24" style="margin-top: 10px">
        <el-button
          v-if="cameraReady && tryCountReady"
          type="primary"
          icon="el-icon-caret-right"
          @click="handleCreate"
        >
          开始考试
        </el-button>
        <el-button v-if="cameraReady" @click="handleBack">
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
import { callCamera, closeCamera } from '@/utils/videoCamera'

export default {
  name: 'ExamOnlineDoPrepare',
  data() {
    return {
      detailData: {},
      videoWidth: 400,
      videoHeight: 300,
      videoCamera: {},
      userExam: {},
      tryCount: 1,
      cameraReady: false,
      tryCountReady: false,
      ssCountAlert: '',
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
    this.loadDictionaryById(144).then(res => {
      this.openTypes = res.details
    })
    this.fetchData()
  },
  beforeDestroy() {
    // 关闭摄像头
    if (this.detailData.photoFrequency > 0 && this.videoCamera) {
      closeCamera(this.videoCamera).then(() => {
      }).catch((reason) => {
        this.$notify({
          title: '关闭摄像头失败（PS：关闭浏览器可以解决该问题）！',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    }
  },
  methods: {
    fetchData() {
      fetchDetail(this.postForm.examId).then(response => {
        this.detailData = response.data
        this.ssCountAlert = '注意：本次考试切屏超过' + this.detailData.ssCount + '次后，系统将自动交卷！'
        if (this.detailData.allowTimes > 0) {
          this.postRequest('gateway/exam/api/user/exam/detail/' + this.postForm.examId, null, false).then(response => {
            if (response.data) {
              this.userExam = response.data
              if (this.userExam.tryCount) {
                this.tryCount = this.userExam.tryCount + 1
              } else {
                this.tryCount = 1
              }
            }
            this.tryCountReady = this.detailData.allowTimes >= this.tryCount
          }).catch((reason) => {
            this.$notify({
              title: '获取考试信息失败',
              message: reason.message,
              type: 'error',
              duration: 5000
            })
            this.tryCount = 1
            this.tryCountReady = this.detailData.allowTimes >= this.tryCount
          })
        } else {
          this.tryCountReady = true
        }
        // 开启摄像头
        if (this.tryCountReady && this.detailData.photoFrequency > 0) {
          this.videoCamera = this.$refs['videoCamera']
          callCamera(this.videoCamera).then(value => {
            this.cameraReady = true
          }).catch((reason) => {
            this.cameraReady = false
            this.$notify({
              title: '该考试需要开启摄像头，请检查摄像头是否可用！',
              message: reason.message,
              type: 'error',
              duration: 5000
            })
          })
        } else {
          this.cameraReady = true
        }
      }).catch((reason) => {
        this.$notify({
          title: '获取试卷失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
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
        // 关闭摄像头
        if (this.detailData.photoFrequency > 0 && this.videoCamera) {
          closeCamera(this.videoCamera).then(() => {
          }).catch((reason) => {
            this.$notify({
              title: '关闭摄像头失败，关闭浏览器可以解决该问题！',
              message: reason.message,
              type: 'error',
              duration: 5000
            })
          })
        }
        setTimeout(function() {
          loading.close()
          that.dialogVisible = false
          that.$router.push({ name: 'ExamOnlineDoExam', params: { id: data.id }})
        }, 1000)
      }).catch((reason) => {
        this.$notify({
          title: '创建试卷失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
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


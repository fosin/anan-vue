<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="24" style="margin-bottom: 20px">
        <el-alert
          title="点击`开始考试`后将自动进入考试，请诚信考试！"
          type="error"
          style="margin-bottom: 10px"
        />
        <el-card class="pre-exam">
          <div><strong>考试名称：</strong>{{ detailData.title }}</div>
          <div><strong>考试时长：</strong>{{ detailData.totalTime }}分钟</div>
          <div><strong>试卷总分：</strong>{{ detailData.totalScore }}分</div>
          <div><strong>及格分数：</strong>{{ detailData.qualifyScore }}分</div>
          <div><strong>考试描述：</strong>{{ detailData.content }}</div>
          <div><strong>开放类型：</strong> {{ getDicDetailValue(openTypes, detailData.openType) }}</div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-button type="primary" icon="el-icon-caret-right" @click="handleCreate">
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
    }).catch((error) => {
      this.$notify({
        title: '加载字典开放类型失败',
        message: error.message,
        type: 'error',
        duration: 5000
      })
    })
  },
  methods: {
    fetchData() {
      fetchDetail(this.postForm.examId).then(response => {
        this.detailData = response.data
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
          that.$store.dispatch('closeAndPushToView', { name: 'ExamOnlineDoExam', params: { id: data.id }})
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

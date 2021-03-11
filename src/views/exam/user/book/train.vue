<template>
  <div class="app-container">
    <el-card style="margin-top: 20px">
      <div class="qu-content">
        <el-input
          ref="quContent"
          v-model="quData.quContent"
          autosize
          type="textarea"
          readonly
          resize="none"
          style="margin-bottom: 20px;border: 0"
        />
        <div v-if="quData.quType === 1 || quData.quType===3 ">
          <el-radio-group v-model="answerValues[0]" readonly>
            <el-radio v-for="an in quData.answerList" :key="an.id" :label="an.id" readonly>{{ an.abc }}.{{ an.content }}</el-radio>
          </el-radio-group>
        </div>
        <!-- 多选题 -->
        <div v-if="quData.quType === 2">
          <el-checkbox-group v-model="answerValues" readonly>
            <el-checkbox v-for="an in quData.answerList" :key="an.id" :label="an.id">{{ an.abc }}.{{ an.content }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <!--        <div v-if="analysisShow" style="margin-top: 20px; color: #1890ff; font-weight: bold">
          正确答案：{{ rightTags.join(' ') }}
        </div>-->
      </div>
    </el-card>
    <el-card v-if="analysisShow" class="qu-analysis" style="margin-top: 20px">
      整题解析：
      <el-input v-model="quData.analysis" type="textarea" autosize readonly />
      <p v-if="!quData.analysis">暂无解析内容！</p>
    </el-card>
    <el-card v-if="analysisShow" class="qu-analysis" style="margin-top: 20px;">
      选项解析：
      <div v-for="an in quData.answerList" :key="an.id" class="qu-analysis-line">
        <p v-if="an.analysis" style="color: #555;">{{ an.content }}：</p>
        <p v-if="an.analysis" style="color: #1890ff;">{{ an.analysis }}</p>
      </div>
      <!--      <p v-if="analysisCount === 0">暂无选项解析</p>-->
    </el-card>
    <div style="padding-top: 30px">
      <el-button type="primary" @click="handNext">继续下一题</el-button>
      <el-button type="info" @click="onCancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import { fetchDetail } from '@/views/exam/qu/qu/qu'
import { nextQu } from '@/views/exam/user/book/book'

export default {
  name: 'ExamOnlineResultsTraining',
  data() {
    return {
      examId: '',
      quId: '',
      tags: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
      analysisShow: false,
      quData: {

      },
      answerValues: [],
      rightValues: [],
      rightTags: [],
      quTypes: []
    }
  },
  created() {
    this.examId = this.$route.params.examId
    this.loadDictionaryById(142).then(res => {
      this.quTypes = res.details
      this.fetchNextQu()
    })
  },
  methods: {

    // 清理值
    clearValues() {
      this.answerValues = []
      this.rightValues = []
      this.analysisShow = false
      this.rightTags = []
    },

    // 查找试卷详情
    fetchQuDetail(id) {
      // 当前赋值
      this.quId = id
      this.clearValues()

      fetchDetail(id).then(response => {
        // 试题信息
        this.quData = response.data
        this.quData.quContent = '【' + this.getDicDetailValue(this.quTypes, this.quData.quType) + '】' + this.quData.content
        // 保存正确答案
        this.quData.answerList.forEach((an, index) => {
          an.abc = this.tags[index]

          // 用户选定的
          if (an.isRight) {
            this.rightValues.push(an.id)
            this.rightTags.push(an.abc)
          }
        })
      }).catch((reason) => {
        this.$notify({
          title: '获取试题数据失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },

    fetchNextQu() {
      // 查找下一个
      nextQu(this.examId, this.quId).then(response => {
        this.fetchQuDetail(response.data.id)
      })
    },
    onCancel() {
      this.$store.dispatch('closeAndPushToView', { name: 'ExamOnlineResultsRecords' })
    },

    handNext() {
      // 直接显示下一个
      if (this.analysisShow) {
        // 正确显示下一个
        this.fetchNextQu()
      } else {
        // 直接判断正确性
        if (this.rightValues.join(',') === this.answerValues.join(',')) {
          this.$message({
            message: '回答正确，你好棒哦！',
            type: 'success'
          })

          // 正确显示下一个
          this.fetchNextQu()
        } else {
          // 错误显示解析
          this.analysisShow = true

          this.$message({
            message: '很遗憾，又做错了呢，请参考答案解析！',
            type: 'error'
          })
        }
      }
    }

  }
}
</script>

<style scoped>

  .qu-content div{
    line-height: 30px;
  }

  .qu-analysis p{
    color: #555; font-size: 14px
  }
  .qu-analysis-line{
    margin-top: 20px; border-bottom: #eee 1px solid
  }

  .el-checkbox-group label,.el-radio-group label{
    width: 100%;
  }

</style>


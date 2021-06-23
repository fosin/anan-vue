<template>
  <div class="app-container">
    <el-card v-if="!resultShow" style="margin-top: 20px">
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
            <el-radio v-for="an in quData.answerList" :key="an.id" :label="an.id" readonly @change="handNext">
              {{ an.abc }}.{{ an.content }}</el-radio>
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
    <el-card v-if="!resultShow && analysisShow" class="qu-analysis" style="margin-top: 20px">
      整题解析：
      <el-input v-model="quData.analysis" type="textarea" autosize readonly />
      <p v-if="!quData.analysis">暂无解析内容！</p>
    </el-card>
    <el-card v-if="!resultShow && analysisShow" class="qu-analysis" style="margin-top: 20px;">
      选项解析：
      <div v-for="an in quData.answerList" :key="an.id" class="qu-analysis-line">
        <p v-if="an.analysis" style="color: #555;">{{ an.content }}：</p>
        <p v-if="an.analysis" style="color: #1890ff;">{{ an.analysis }}</p>
      </div>
      <!--      <p v-if="analysisCount === 0">暂无选项解析</p>-->
    </el-card>
    <el-card v-if="resultShow" style="margin-top: 20px;">
      <el-form label-width="120px">
        <el-form-item label="总数量：">
          <el-tag>{{ rightCount + wrongCount }}</el-tag>
        </el-form-item>
        <el-form-item label="正确数量：">
          <el-tag type="success">{{ rightCount }}</el-tag>
        </el-form-item>
        <el-form-item label="错误数量：">
          <el-tag type="danger">{{ wrongCount }}</el-tag>
        </el-form-item>
        <el-form-item label="正确率：">
          <el-tag type="warning">{{ rightCount / (rightCount + wrongCount) * 100 }}%</el-tag>
        </el-form-item>
      </el-form>
    </el-card>
    <div style="padding-top: 30px">
      <el-button v-if="!resultShow" type="success" @click="fetchNextQu(1)">跳过这题</el-button>
      <el-button v-if="!resultShow" type="primary" style="margin-left: 50px" @click="handNext">继续下一题</el-button>
      <el-button v-if="resultShow" type="primary" style="margin-left: 50px" @click="handleRestart">再测一次</el-button>
      <el-button type="info" style="float: right" @click="onCancel">返回</el-button>
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
      quTypes: [],
      resultShow: false,
      wrongCount: 0,
      rightCount: 0
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
        this.quData.quContent = '【' + this.getAnanDicValue(this.quTypes, this.quData.quType) + '】' + this.quData.content
        // 保存正确答案
        this.quData.answerList.forEach((an, index) => {
          an.abc = this.tags[index]
          // 正确答案
          if (an.isRight) {
            this.rightValues.push(an.id)
            this.rightValues.sort()
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
    handleRestart() {
      this.rightCount = 0
      this.wrongCount = 0
      this.resultShow = false
      this.quId = ''
      this.clearValues()
      this.fetchNextQu(2)
    },
    fetchNextQu(type) {
      if (type === 1) {
        this.wrongCount++
      }
      // 查找下一个
      nextQu(this.examId, this.quId).then(response => {
        const id = response.data.id
        if (id) {
          this.fetchQuDetail(response.data.id)
        } else {
          this.resultShow = true
        }
      })
    },
    onCancel() {
      this.$store.dispatch('closeAndPushToView', { name: 'ExamOnlineResultsRecords' })
    },
    handNext() {
      // 直接判断正确性
      this.answerValues.sort()
      if (this.rightValues.join(',') === this.answerValues.join(',')) {
        // 正确显示下一个
        this.rightCount++
        this.fetchNextQu(2)
      } else {
        // 错误显示解析
        this.analysisShow = true
        this.$message({
          message: '做错了，请参考解析重试！',
          type: 'error'
        })
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


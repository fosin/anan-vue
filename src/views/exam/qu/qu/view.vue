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
          @select="disableSelect"
        />
        <div v-if="quData.quType === 1">
          <el-radio-group v-model="radioValues">
            <el-radio v-for="an in quData.answerList" :key="an.id" :label="an.id">{{ an.content }}</el-radio>
          </el-radio-group>
        </div>
        <!-- 多选题 -->
        <div v-if="quData.quType === 2">
          <el-checkbox-group v-model="multiValues">
            <el-checkbox v-for="an in quData.answerList" :key="an.id" :label="an.id">{{ an.content }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </el-card>
    <el-card class="qu-analysis" style="margin-top: 20px">
      整题解析：
      <el-input v-if="quData.analysis" v-model="quData.analysis" type="textarea" autosize readonly />
      <p v-else>暂无解析内容！</p>
    </el-card>
    <el-card class="qu-analysis" style="margin-top: 20px; margin-bottom: 30px">
      选项解析：
      <div v-for="an in quData.answerList" :key="an.id" class="qu-analysis-line">
        <p v-if="an.analysis" style="color: #555;">{{ an.content }}：</p>
        <p v-if="an.analysis" style="color: #1890ff;">{{ an.analysis }}</p>
      </div>
      <p v-if="analysisCount === 0">暂无选项解析</p>
    </el-card>
    <!--    <el-button type="info" @click="onCancel">返回</el-button>-->
  </div>
</template>

<script>
import { fetchDetail } from '@/views/exam/qu/qu/qu'
import { controlCopy } from '@/utils/documentUtil'

export default {
  name: 'ExamOnlineViewQu',
  data() {
    return {
      quData: {
      },
      radioValues: '',
      multiValues: [],
      quTypes: [],
      analysisCount: 0
    }
  },
  mounted() {
    const id = this.$route.params.id
    if (typeof id !== 'undefined') {
      this.loadDictionaryById(142).then(res => {
        this.quTypes = res.details
        this.fetchData(id)
      })
    }
    // 禁止鼠标右键菜单
    controlCopy(true)
  },
  beforeDestroy() {
    // 禁止鼠标右键菜单
    controlCopy(false)
  },
  methods: {
    disableSelect() {
      // TODO 无法生效
      return false
    },
    fetchData(id) {
      fetchDetail(id).then(response => {
        this.quData = response.data
        this.quData.quContent = '【' + this.getAnanDicValue(this.quTypes, this.quData.quType) + '】' + this.quData.content
        this.quData.answerList.forEach((an) => {
          // 解析数量
          if (an.analysis) {
            this.analysisCount += 1
          }
          // 用户选定的
          // if (an.isRight) {
          //   if (this.quData.quType === 1) {
          //     this.radioValues = an.id
          //   } else {
          //     this.multiValues.push(an.id)
          //   }
          // }
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
    onCancel() {
      this.$store.dispatch('closeAndPushToView', { name: 'ExamOnlineResultsRecords' })
    }
  }
}
</script>

<style scoped>

  .qu-content{
    padding-bottom: 10px;
  }

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


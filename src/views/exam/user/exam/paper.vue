<template>
  <div>
    <el-card v-for="item in paperList" :key="item.id" style="margin-bottom: 10px; line-height: 30px;">
      <el-row>
        <el-col :span="6">
          合格分/总分：{{ item.qualifyScore }} / {{ item.totalScore }}
        </el-col>
        <el-col :span="5">
          考试用时：{{ item.userTime }}分钟
        </el-col>
        <el-col :span="6">
          考试状态：{{ getAnanDicValue(paperStates, item.state) }}
        </el-col>
        <el-col :span="7">
          考试时间：{{ item.createTime }}
        </el-col>
        <el-col v-if="item.state ===2 || item.state ===3" :span="6">
          得分/正确率：{{ item.userScore }} / {{ item.accuracy }}%
        </el-col>
        <el-col v-if="item.state ===2 || item.state ===3" :span="5">
          考试评级：<span :style="{ color: gradeColor[item.grade] }">{{ getAnanDicValue(gradeDics, item.grade) }}</span>
        </el-col>
        <el-col v-if="item.showPaper" :span="6">
          <el-button type="primary" size="mini" icon="el-icon-user" @click="handleExamResult(item.id)">考试详情</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>

import { listPaper } from '@/views/exam/paper/paper/paper'

export default {
  name: 'UserPaperList',
  props: {
    examId: {
      type: String,
      default: ''
    },
    userId: {
      type: Number,
      default: -1
    },
    showAll: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      gradeDics: [],
      gradeColor: {
        0: '#ff0000',
        1: '#00ff00',
        2: '#0000FF',
        3: '#FF00FF',
        4: '#ff8000'
      },
      value1: null,
      paperList: [],
      paperStates: []
    }
  },

  watch: {
    // 检测查询变化
    examId: {
      handler() {
        this.fetchPaperList()
      },
      deep: true
    },
    // 检测查询变化
    userId: {
      handler() {
        this.fetchPaperList()
      },
      deep: true
    }
  },
  created() {
    this.loadDictionaryById(143).then(res => {
      this.paperStates = res.details
    })
    this.loadDictionaryById(148).then(res => {
      this.gradeDics = res.details
    })
    this.fetchPaperList()
  },
  methods: {
    fetchPaperList() {
      listPaper(this.userId, this.examId).then(response => {
        this.paperList = response.data.data
      }).catch((reason) => {
        this.$notify({
          title: '获取试卷数据失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    handleExamResult(id) {
      this.$store.dispatch('pushToView', { name: 'ExamOnlineDoResult', params: { id: id + ',' + this.showAll }})
    }
  }
}
</script>

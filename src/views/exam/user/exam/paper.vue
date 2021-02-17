<template>
  <div>
    <el-card v-for="item in paperList" :key="item.id" style="margin-bottom: 10px; line-height: 30px;">
      <el-row :gutter="20">
        <el-col :span="8">
          考试时间：{{ item.createTime }}
        </el-col>
        <el-col :span="8">
          考试用时：{{ item.userTime }}分钟
        </el-col>
        <el-col :span="8">
          得分/总分：{{ item.userScore }} / {{ item.totalScore }}
        </el-col>
        <el-col v-if="item.state !==1" :span="8">
          <el-span v-if="item.userScore >= item.qualifyScore" style="color: #24da70">是否合格：是</el-span>
          <el-span v-else style="color: #ff0000">是否合格：否</el-span>
        </el-col>
        <el-col :span="8">
          考试状态：{{ getDicDetailValue(paperStates, item.state) }}
        </el-col>
        <el-col :span="8">
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
    this.fetchPaperList()
  },
  methods: {
    fetchPaperList() {
      listPaper(this.userId, this.examId).then(response => {
        this.paperList = response.data.records
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

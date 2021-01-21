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
          考试得分：{{ item.userScore }}
        </el-col>
        <el-col :span="8">
          是否合格：{{ item.userScore > item.qualifyScore ? '是' : '否' }}
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
      })
    },
    handleExamResult(id) {
      this.$router.push({ name: 'ExamOnlineDoResult', params: { id: id + ',' + this.showAll }})
    }
  }
}
</script>

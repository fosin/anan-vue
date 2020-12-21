<template>

  <div>

    <el-card v-for="item in paperList" :key="item.id" style="margin-bottom: 10px; line-height: 30px;">

      <el-row :gutter="20">
        <el-col :span="12">
          考试时间：{{ item.createTime }}
        </el-col>

        <el-col :span="12">
          考试用时：{{ item.userTime }}分钟
        </el-col>

        <el-col :span="12">
          考试得分：{{ item.userScore }}
        </el-col>

        <el-col :span="12">
          是否合格：{{ item.userScore > item.qualifyScore ? '是' : '否' }}
        </el-col>

        <el-col :span="12">
          考试状态：{{ getDicDetailValue(paperStates, item.state) }}

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
      type: String,
      default: ''
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
    this.$store.dispatch('LoadDictionaryById', 143).then(res => {
      this.paperStates = res.details
    }).catch((error) => {
      this.$notify({
        title: '加载字典试卷状态失败',
        message: error.message,
        type: 'error',
        duration: 5000
      })
    })
    this.fetchPaperList()
  },
  methods: {

    fetchPaperList() {
      listPaper(this.userId, this.examId).then(response => {
        this.paperList = response.data.records
      })
    }
  }
}
</script>

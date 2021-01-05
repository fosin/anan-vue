<template>
  <div class="app-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" label-position="left" label-width="150px">
      <el-card>
        <el-row>
          <el-col :span="8">
            <el-form-item label="题目类型 " prop="quType">
              <el-select v-model="postForm.quType" :disabled="quTypeDisabled" class="filter-item" @change="handleTypeChange">
                <el-option
                  v-for="item in quTypes"
                  :key="item.name"
                  :label="item.value"
                  :value="item.name"
                  :disabled="item.status === 1"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="难度等级 " prop="level">
              <el-select v-model="postForm.level" class="filter-item">
                <el-option
                  v-for="item in levels"
                  :key="item.name"
                  :label="item.value"
                  :value="item.name"
                  :disabled="item.status === 1"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="归属题库" prop="repoIds">
              <repo-select v-model="postForm.repoIds" :multi="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="题目内容" prop="content">
          <el-input v-model="postForm.content" type="textarea" />
        </el-form-item>
        <el-form-item label="整题解析" prop="oriPrice">
          <el-input v-model="postForm.analysis" type="textarea" :precision="1" :max="999999" />
        </el-form-item>
      </el-card>
      <div v-if="postForm.quType!==4" class="filter-container" style="margin-top: 25px">
        <div style="margin-top: 10px;margin-bottom: 10px;">
          <el-row>
            <el-col :span="6">
              <el-button type="primary" icon="el-icon-plus" plain @click="handleAdd">添加</el-button>
            </el-col>
            <el-col :span="6">
              <el-button type="success" icon="el-icon-circle-plus" plain @click="submitForm">保存</el-button>
            </el-col>
            <el-col :span="6">
              <el-button type="info" icon="el-icon-close" plain @click="onCancel">返回</el-button>
            </el-col>
            <el-col :span="6" />
          </el-row>
        </div>
        <el-table
          :data="postForm.answerList"
          :border="true"
          style="width: 100%;"
        >
          <el-table-column
            label="是否答案"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.isRight">答案</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            label="答案内容"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.content" type="textarea" />
            </template>
          </el-table-column>
          <el-table-column
            label="答案解析"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.analysis" type="textarea" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="100px"
          >
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" circle @click="removeItem(scope.$index)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
  </div>
</template>

<script>
import { fetchDetail, saveData } from '@/views/exam/qu/qu/qu'
import RepoSelect from '@/views/exam/components/RepoSelect'

export default {
  name: 'ExamManagementQuUpdate',
  components: { RepoSelect },
  data() {
    return {
      quTypeDisabled: false,
      levels: [],
      quTypes: [],
      postForm: {
        repoIds: [],
        tagList: [],
        answerList: [],
        quType: 1,
        level: 1
      },
      lastSelected: 0,
      rules: {
        content: [
          { required: true, message: '题目内容不能为空！' }
        ],
        quType: [
          { required: true, message: '题目类型不能为空！' }
        ],
        level: [
          { required: true, message: '必须选择难度等级！' }
        ],
        repoIds: [
          { required: true, message: '至少要选择一个题库！' }
        ]
      }
    }
  },
  created() {
    const id = this.$route.params.id
    this.loadDictionaryById(146).then(res => {
      const levels = res.details
      // 删除不限
      const newLevels = []
      for (let i = 0; i < levels.length; i++) {
        const v = levels[i]
        if (v.name !== 0) {
          newLevels.push(v)
        }
      }
      this.levels = newLevels
    })
    this.loadDictionaryById(142).then(res => {
      this.quTypes = res.details
    })
    if (typeof id !== 'undefined') {
      this.quTypeDisabled = true
      this.fetchData(id)
    }
    this.handleTypeChange(this.postForm.quType)
  },
  methods: {
    handleTypeChange(v) {
      if (v === 3) {
        this.postForm.answerList = []
        this.postForm.answerList.push({ isRight: true, content: '正确', analysis: '' })
        this.postForm.answerList.push({ isRight: false, content: '错误', analysis: '' })
      }
      if (v === 1 || v === 2) {
        if (this.lastSelected === 3 || !this.postForm.answerList) {
          this.postForm.answerList = []
        }
        if (this.postForm.answerList.length < 3) {
          this.postForm.answerList.push({ isRight: false, content: '', analysis: '' })
          this.postForm.answerList.push({ isRight: false, content: '', analysis: '' })
          this.postForm.answerList.push({ isRight: false, content: '', analysis: '' })
          this.postForm.answerList.push({ isRight: false, content: '', analysis: '' })
        }
      }
      this.lastSelected = v
    },
    // 添加子项
    handleAdd() {
      this.postForm.answerList.push({ isRight: false, content: '', analysis: '' })
    },
    removeItem(index) {
      this.postForm.answerList.splice(index, 1)
    },
    fetchData(id) {
      fetchDetail(id).then(response => {
        this.postForm = response.data
      })
    },
    submitForm() {
      let rightCount = 0
      this.postForm.answerList.forEach(function(item) {
        if (item.isRight) {
          rightCount += 1
        }
      })
      if (this.postForm.quType === 1) {
        if (rightCount !== 1) {
          this.$message({
            message: '单选题答案只能有一个',
            type: 'warning'
          })
          return
        }
      }
      if (this.postForm.quType === 2) {
        if (rightCount < 2) {
          this.$message({
            message: '多选题至少要有两个正确答案！',
            type: 'warning'
          })
          return
        }
      }
      if (this.postForm.quType === 3) {
        if (rightCount !== 1) {
          this.$message({
            message: '判断题只能有一个正确项！',
            type: 'warning'
          })
          return
        }
      }
      this.$refs.postForm.validate((valid) => {
        if (!valid) {
          return
        }
        saveData(this.postForm).then(response => {
          this.$notify({
            title: '成功',
            message: '试题保存成功！',
            type: 'success',
            duration: 2000
          })
          if (this.$route.params.id) {
            this.$store.dispatch('closeAndPushToView', { name: 'ExamManagementQu' })
          } else {
            this.continueForm()
          }
        })
      })
    },
    continueForm() {
      const form = {
        quType: this.postForm.quType,
        level: this.postForm.level,
        repoIds: this.postForm.repoIds
      }
      this.postForm = form
      this.handleTypeChange(form.quType)
    },
    onCancel() {
      this.$store.dispatch('closeAndPushToView', { name: 'ExamManagementQu' })
    }
  }
}
</script>

<style scoped>

</style>


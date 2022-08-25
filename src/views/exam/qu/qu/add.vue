<template>
  <div class="app-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" label-position="left" label-width="150px">
      <el-card>
        <el-row>
          <el-col :span="5">
            <el-form-item label="试题类型" prop="quType" label-width="80px">
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
          <el-col :span="5">
            <el-form-item label="难度等级" prop="level" label-width="80px">
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
          <el-col :span="6">
            <el-form-item label="归属题库" prop="repoList" label-width="80px">
              <repo-tree-select v-model="repoId" :user-id="ananUserInfo.id" @nodeClick="onNodeClick" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="启用状态" prop="state" label-width="80px">
              <el-select v-model="postForm.state" class="filter-item">
                <el-option :key="0" label="启用" :value="0" />
                <el-option :key="1" label="禁用" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="选题权重" prop="weight" label-width="80px">
              <el-input-number v-model="postForm.weight" :step="1" :min="1" :max="1000" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="试题内容" prop="content" label-width="80px">
          <el-input v-model="postForm.content" type="textarea" autosize />
        </el-form-item>
        <el-form-item label="整题解析" prop="analysis" label-width="80px">
          <el-input v-model="postForm.analysis" type="textarea" autosize />
        </el-form-item>
      </el-card>
      <div style="margin-top: 10px;margin-bottom: 10px;">
        <el-row>
          <el-col :span="6">
            <el-button type="info" icon="el-icon-back" plain @click="onCancel">返回</el-button>
          </el-col>
          <el-col :span="6">
            <el-button type="success" icon="el-icon-check" plain @click="submitForm">保存</el-button>
          </el-col>
          <el-col v-if="allowAdd" :span="6">
            <el-button type="primary" icon="el-icon-plus" plain @click="handleAdd()">添加</el-button>
          </el-col>
          <el-col :span="6" />
        </el-row>
      </div>
      <div v-if="postForm.quType!==4" class="filter-container" style="margin-top: 25px">
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
              <el-input v-model="scope.row.content" type="textarea" autosize />
            </template>
          </el-table-column>
          <el-table-column
            label="答案解析"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.analysis" type="textarea" autosize />
            </template>
          </el-table-column>
          <el-table-column
            v-if="allowDel"
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
import RepoTreeSelect from '@/views/exam/components/RepoTreeSelect'
import { createOrUpdate, fetchDetail } from '@/views/exam/qu/qu/qu'
import { mapGetters } from 'vuex'

export default {
  name: 'ExamManagementQuAdd',
  components: { RepoTreeSelect },
  data() {
    return {
      quTypeDisabled: false,
      allowAdd: true,
      allowDel: true,
      levels: [],
      quTypes: [],
      postForm: {
        repoList: [],
        tagList: [],
        answerList: [],
        quType: 1,
        weight: 1,
        state: 0,
        level: 1
      },
      repoId: '',
      lastSelected: 0,
      rules: {
        content: [
          { required: true, message: '试题内容不能为空！' }
        ],
        quType: [
          { required: true, message: '试题类型不能为空！' }
        ],
        level: [
          { required: true, message: '必须选择难度等级！' }
        ],
        repoList: [
          { required: true, message: '至少要选择一个题库！' }
        ],
        state: [
          { required: true, message: '至少要选择一个状态！' }
        ],
        weight: [
          { required: true, message: '权重不能小于1！' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['ananUserInfo'])
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
    } else {
      this.handleTypeChange(this.postForm.quType)
    }
  },
  methods: {
    onNodeClick(node) {
      this.postForm.repoList = []
      if (node) {
        this.postForm.repoList.push({
          repoId: node.id,
          quType: this.postForm.quType,
          sort: 1
        })
      }
    },
    initType(v) {
      if (v === 1 || v === 2) {
        this.allowAdd = true
        this.allowDel = true
      }
      if (v === 3 || v === 4) {
        this.allowAdd = false
        this.allowDel = false
      }
      if (this.postForm && this.postForm.repoList && this.postForm.repoList.length > 0) {
        this.repoId = this.postForm.repoList[0].repoId
      }
    },
    handleTypeChange(v) {
      this.initType(v)
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
      if (v === 3) {
        if (!this.postForm.answerList || this.postForm.answerList.length !== 2) {
          this.postForm.answerList = []
          this.postForm.answerList.push({ isRight: true, content: '正确', analysis: '' })
          this.postForm.answerList.push({ isRight: false, content: '错误', analysis: '' })
        }
      }
      if (v === 4) {
        this.postForm.answerList = []
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
        this.postForm = response.data.data
        this.initType(this.postForm.quType)
      }).catch((reason) => {
        this.$notify({
          title: '获取数据失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
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
        createOrUpdate(this.postForm).then(() => {
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
        }).catch((reason) => {
          this.$notify({
            title: '保存试题失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      })
    },
    continueForm() {
      const form = {
        quType: this.postForm.quType,
        level: this.postForm.level,
        repoList: this.postForm.repoList,
        weight: 1,
        state: this.postForm.state
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
.el-input-number--medium {
  width: 120px;
  line-height: 34px;
}
</style>


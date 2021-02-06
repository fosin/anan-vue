<template>
  <div class="app-container">
    <el-steps :active="step" simple>
      <el-step title="组卷配置" icon="el-icon-set-up" />
      <el-step title="考试权限" icon="el-icon-unlock" />
      <el-step title="补充配置" icon="el-icon-s-tools" />
    </el-steps>
    <div style="margin-top: 20px;width:100%; height: 40px;">
      <el-button v-if="step > 1" @click="prevStep">上一步</el-button>
      <el-button type="primary" style="float:right;" @click="nextStep">{{ step===3?'提交保存':'下一步' }}</el-button>
    </div>
    <el-card v-if="step === 1" style="margin-top: 20px">
      <div style="float: right; font-weight: bold; color: #ff0000">试卷总分：{{ postForm.totalScore }}分</div>
      <div>
        <div style="margin-bottom: 20px">
          <el-select v-model="postForm.level" class="filter-item" placeholder="选择难度等级" clearable="">
            <el-option
              v-for="item in levels"
              :key="item.name"
              :label="item.value"
              :value="item.name"
              :disabled="item.status === 1"
            />
          </el-select>
        </div>
        <el-button class="filter-item" size="small" type="primary" icon="el-icon-plus" @click="handleAdd">
          添加题库
        </el-button>
        <el-table
          :data="repoList"
          :border="false"
          empty-text="请点击上面的`添加题库`进行设置"
          style="width: 100%; margin-top: 15px"
        >
          <el-table-column
            label="题库"
            width="200"
          >
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.repoId"
                filterable
                remote
                reserve-keyword
                clearable
                automatic-dropdown
                placeholder="选择或搜索题库"
                :remote-method="fetchData"
                class="filter-item"
                @change="repoSelected"
              >
                <el-option
                  v-for="item in reposData"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="单选数量"
            align="center"
          >
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.radioCount"
                style="width: 55%"
                :controls="false"
                :min="0"
                :max="scope.row.radioCountMax"
                :disabled="scope.row.radioCountMax < 1"
              />/{{ scope.row.radioCountMax }}题
            </template>
          </el-table-column>
          <el-table-column
            label="单选分数"
            align="center"
          >
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.radioScore" style="width: 50%" :controls="false" :min="0" />
            </template>
          </el-table-column>
          <el-table-column
            label="多选数量"
            align="center"
          >
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.multiCount"
                style="width: 55%"
                :controls="false"
                :min="0"
                :max="scope.row.multiCountMax"
                :disabled="scope.row.multiCountMax < 1"
              />/{{ scope.row.multiCountMax }}题
            </template>
          </el-table-column>
          <el-table-column
            label="多选分数"
            align="center"
          >
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.multiScore" style="width: 50%" :controls="false" :min="0" />
            </template>
          </el-table-column>
          <el-table-column
            label="判断题数量"
            align="center"
          >
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.judgeCount"
                style="width: 55%"
                :controls="false"
                :min="0"
                :max="scope.row.judgeCountMax"
                :disabled="scope.row.judgeCountMax < 1"
              />/{{ scope.row.judgeCountMax }}题
            </template>
          </el-table-column>
          <el-table-column
            label="判断题分数"
            align="center"
          >
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.judgeScore" style="width: 50%" :controls="false" :min="0" />
            </template>
          </el-table-column>
          <el-table-column
            label="简答题数量"
            align="center"
          >
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.saqCount"
                style="width: 55%"
                :controls="false"
                :min="0"
                :max="scope.row.saqCountMax"
                :disabled="scope.row.saqCountMax < 1"
              />/{{ scope.row.saqCountMax }}题
            </template>
          </el-table-column>
          <el-table-column
            label="简答题分数"
            align="center"
          >
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.saqScore" style="width: 50%" :controls="false" :min="0" />
            </template>
          </el-table-column>
          <el-table-column
            label="删除"
            align="center"
            width="50px"
          >
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" circle @click="removeItem(scope.$index)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card v-if="step === 2" style="margin-top: 20px;">
      <el-radio-group v-model="postForm.openType" style="margin-bottom: 20px">
        <el-radio :label="1" border>完全公开</el-radio>
        <el-radio :label="2" border>部门开放</el-radio>
      </el-radio-group>
      <el-alert
        v-if="postForm.openType===1"
        title="开放的，任何人都可以进行考试！"
        type="warning"
      />
      <div v-if="postForm.openType===2">
        <el-input
          v-model="filterText"
          placeholder="输入关键字进行过滤"
        />
        <el-tree
          ref="tree"
          v-loading="treeLoading"
          :load="loadChild"
          :default-expanded-keys="defaultExpandedKeys"
          :filter-node-method="filterNode"
          :props="defaultProps"
          class="filter-tree"
          node-key="id"
          highlight-current
          lazy
          show-checkbox
          check-strictly
          :default-checked-keys="postForm.departIds"
          @check-change="handleCheckChange"
        />
      </div>
    </el-card>
    <el-card v-if="step === 3" style="margin-top: 20px">
      <el-form ref="postForm" :model="postForm" :rules="rules" label-position="left" label-width="120px">
        <el-form-item label="考试名称" prop="title" label-width="80px">
          <el-input v-model="postForm.title" />
        </el-form-item>
        <el-form-item label="考试描述" prop="content" label-width="80px">
          <el-input v-model="postForm.content" type="textarea" />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="总分数" prop="totalScore" label-width="80px">
              <el-input-number :value="postForm.totalScore" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="及格分" prop="qualifyScore" label-width="80px">
              <el-input-number v-model="postForm.qualifyScore" :max="postForm.totalScore" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="考试时长" prop="totalTime" label-width="80px">
              <el-input-number v-model="postForm.totalTime" />分钟
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <el-form-item label="查看试卷" label-width="80px">
              <el-checkbox v-model="postForm.showPaper" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="查看对错" label-width="80px">
              <el-checkbox v-model="postForm.showResult" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="查看答案" label-width="80px">
              <el-checkbox v-model="postForm.showAnswer" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="是否限时" label-width="80px">
              <el-checkbox v-model="postForm.timeLimit" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="postForm.timeLimit" label="考试时间" prop="totalTime" label-width="80px">
              <el-date-picker
                v-model="dateValues"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <el-form-item label="错题训练" label-width="80px">
              <el-checkbox v-model="postForm.wrongTrain" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="复制试卷" label-width="80px">
              <el-checkbox v-model="postForm.paperCopy" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="切屏次数" prop="ssCount" label-width="80px">
              <el-input-number v-model="postForm.ssCount" :min="0" :max="99" />次
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="拍照频率" label-width="80px">
              <el-input-number v-model="postForm.photoFrequency" :min="0" />秒
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="限考次数" prop="allowTimes" label-width="80px">
              <el-input-number v-model="postForm.allowTimes" :min="0" :max="99" />次
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { fetchDetail, saveData } from '@/views/exam/exam/exam'
import { getOrganiz, listOrganizChild } from '@/views/platform/organization/organization'
import { mapGetters } from 'vuex'
import { fetchList } from '@/views/exam/qu/repo/repo'

export default {
  name: 'ExamManagementExamUpdate',
  data() {
    return {
      step: 1,
      defaultExpandedKeys: [1],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      levels: [],
      filterText: '',
      treeLoading: false,
      dateValues: [],
      quDialogShow: false,
      quDialogType: 1,
      excludes: [],
      scoreDialog: false,
      scoreBatch: 0,
      // 题库
      repoList: [],
      reposData: [],
      // 题目列表
      quList: [[], [], [], []],
      quEnable: [false, false, false, false],
      postForm: {
        // 总分数
        totalScore: 0,
        // 题库列表
        repoList: [],
        // 题目列表
        quList: [],
        // 组题方式
        joinType: 1,
        // 开放类型
        openType: 1,
        // 考试班级列表
        departIds: [],
        // 难度
        level: 0,
        // 查看对错
        showResult: false,
        // 查看试卷
        showPaper: true,
        // 查看考试结果
        ssCount: 0,
        // 查看考试结果
        allowTimes: 3,
        // 复制试卷
        paperCopy: true,
        // 查看考试结果
        wrongTrain: true,
        // 查看考试结果
        photoFrequency: 0,
        // 查看答案
        showAnswer: false
      },
      rules: {
        title: [
          { required: true, message: '考试名称不能为空！' }
        ],
        content: [
          { required: true, message: '考试名称不能为空！' }
        ],
        open: [
          { required: true, message: '考试权限不能为空！' }
        ],
        totalScore: [
          { required: true, message: '考试分数不能为空！' }
        ],
        qualifyScore: [
          { required: true, message: '及格分不能为空！' }
        ],
        totalTime: [
          { required: true, message: '考试时间不能为空！' }
        ],
        ruleId: [
          { required: true, message: '考试规则不能为空' }
        ],
        password: [
          { required: true, message: '考试口令不能为空！' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['ananUserInfo'])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    dateValues: {
      handler() {
        this.postForm.startTime = this.dateValues[0]
        this.postForm.endTime = this.dateValues[1]
      }
    },
    // 题库变换
    repoList: {
      handler() {
        const that = this
        that.postForm.totalScore = 0
        this.repoList.forEach(function(item) {
          that.postForm.totalScore += item.radioCount * item.radioScore
          that.postForm.totalScore += item.multiCount * item.multiScore
          that.postForm.totalScore += item.judgeCount * item.judgeScore
          that.postForm.totalScore += item.saqCount * item.saqScore
        })
        // 赋值
        this.postForm.repoList = this.repoList
      },
      deep: true
    }
  },
  created() {
    const id = this.$route.params.id
    this.loadDictionaryById(146).then(res => {
      this.levels = res.details
    })
    fetchList({}).then(response => {
      this.reposData = response.data
      if (typeof id !== 'undefined') {
        this.fetchData(id)
      }
    }).catch((reason) => {
      this.$notify({
        title: '获取题库数据失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
  },
  methods: {
    repoSelected(repoId) {
      this.repoList.forEach((value2) => {
        if (value2.repoId === repoId) {
          value2 = this.setRepoLimit(value2)
        }
      })
    },
    loadChild(node, resolve) {
      if (node.level === 0) {
        const organizId = this.ananUserInfo.organizId
        if (organizId === 0) {
          listOrganizChild(organizId).then(response => {
            this.defaultExpandedKeys[0] = response.data[0].id
            return resolve(response.data || [])
          }).catch(reason => {
            this.$notify({
              title: '加载子节点失败',
              message: reason.message,
              type: 'error',
              duration: 5000
            })
          })
        } else {
          getOrganiz(organizId).then((response2) => {
            const organizs = []
            organizs.push(response2.data)
            this.defaultExpandedKeys[0] = organizId
            return resolve(organizs || [])
          }).catch(reason => {
            this.$notify({
              title: '加载子节点失败',
              message: reason.message,
              type: 'error',
              duration: 5000
            })
          })
        }
      } else {
        listOrganizChild(node.data.id).then(response => {
          return resolve(response.data || [])
        }).catch(reason => {
          this.$notify({
            title: '加载子节点失败',
            message: reason.message,
            type: 'error',
            duration: 5000
          })
        })
      }
    },
    nextStep() {
      if (this.step < 3) {
        this.step += 1
      } else {
        this.$refs.postForm.validate((valid) => {
          if (!valid) {
            return
          }
          if (this.postForm.totalScore === 0) {
            this.$notify({
              title: '提示信息',
              message: '考试规则设置不正确，请确认！',
              type: 'warning',
              duration: 2000
            })
            return
          }
          if (this.postForm.joinType === 1) {
            for (let i = 0; i < this.postForm.repoList.length; i++) {
              const repo = this.postForm.repoList[i]

              if (!repo.repoId) {
                this.$notify({
                  title: '提示信息',
                  message: '考试题库选择不正确！',
                  type: 'warning',
                  duration: 2000
                })

                return
              }
              if ((repo.radioCount > 0 && repo.radioScore === 0) || (repo.radioCount === 0 && repo.radioScore > 0)) {
                this.$notify({
                  title: '提示信息',
                  message: '题库第：[' + (i + 1) + ']项存在无效的单选题配置！',
                  type: 'warning',
                  duration: 2000
                })

                return
              }
              if ((repo.multiCount > 0 && repo.multiScore === 0) || (repo.multiCount === 0 && repo.multiScore > 0)) {
                this.$notify({
                  title: '提示信息',
                  message: '题库第：[' + (i + 1) + ']项存在无效的多选题配置！',
                  type: 'warning',
                  duration: 2000
                })

                return
              }
              if ((repo.judgeCount > 0 && repo.judgeScore === 0) || (repo.judgeCount === 0 && repo.judgeScore > 0)) {
                this.$notify({
                  title: '提示信息',
                  message: '题库第：[' + (i + 1) + ']项存在无效的判断题配置！',
                  type: 'warning',
                  duration: 2000
                })
                return
              }
              if ((repo.saqCount > 0 && repo.saqScore === 0) || (repo.saqCount === 0 && repo.saqScore > 0)) {
                this.$notify({
                  title: '提示信息',
                  message: '题库第：[' + (i + 1) + ']项存在无效的简答题配置！',
                  type: 'warning',
                  duration: 2000
                })
                return
              }
            }
          }
          this.$confirm('确实要提交保存吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitForm()
          })
        })
      }
    },

    prevStep() {
      this.step -= 1
    },

    handleCheckChange() {
      const that = this
      // 置空
      this.postForm.departIds = []

      const nodes = this.$refs.tree.getCheckedNodes()
      nodes.forEach(function(item) {
        that.postForm.departIds.push(item.id)
      })
    },

    // 添加子项
    handleAdd() {
      const addRepo = { radioCount: 0, radioCountMax: 0, radioScore: 0, multiCount: 0, multiCountMax: 0, multiScore: 0, judgeCount: 0, judgeCountMax: 0, judgeScore: 0, saqCount: 0, saqCountMax: 0, saqScore: 0 }
      if (this.repoList && this.repoList.length > 0) {
        const lastRepo = this.repoList[this.repoList.length - 1]
        addRepo.radioScore = lastRepo.radioScore
        addRepo.multiScore = lastRepo.multiScore
        addRepo.judgeScore = lastRepo.judgeScore
        addRepo.saqScore = lastRepo.saqScore
      }
      this.repoList.push(addRepo)
    },

    removeItem(index) {
      this.repoList.splice(index, 1)
    },
    getRepoData(repoId) {
      if (this.reposData) {
        for (let i = 0; i < this.reposData.length; i++) {
          const repo = this.reposData[i]
          if (repo.id === repoId) {
            return repo
          }
        }
      }
    },
    setRepoLimit(repoBeSet) {
      const repo = this.getRepoData(repoBeSet.repoId)
      if (repo) {
        repoBeSet.radioCountMax = repo.radioCount
        repoBeSet.radioCount = Math.min(repoBeSet.radioCount, repoBeSet.radioCountMax)
        repoBeSet.multiCountMax = repo.multiCount
        repoBeSet.multiCount = Math.min(repoBeSet.multiCount, repoBeSet.multiCountMax)
        repoBeSet.judgeCountMax = repo.judgeCount
        repoBeSet.judgeCount = Math.min(repoBeSet.judgeCount, repoBeSet.judgeCountMax)
        repoBeSet.saqCountMax = repo.saqCount
        repoBeSet.saqCount = Math.min(repoBeSet.saqCount, repoBeSet.saqCountMax)
      }
    },
    fetchData(id) {
      const that = this

      fetchDetail(id).then(response => {
        this.postForm = response.data
        this.dateValues[0] = this.postForm.startTime
        this.dateValues[1] = this.postForm.endTime

        // 按分组填充题目
        if (this.postForm.joinType === 2) {
          this.postForm.quList.forEach(function(item) {
            const index = item.quType - 1
            that.quList[index].push(item)
            that.quEnable[index] = true
          })
        }
        if (this.postForm.joinType === 1) {
          that.repoList = that.postForm.repoList
          that.repoList.forEach(value => {
            value = this.setRepoLimit(value)
          })
        }
      }).catch((reason) => {
        this.$notify({
          title: '获取考试数据失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },

    submitForm() {
      // 校验和处理数据
      this.postForm.repoList = this.repoList

      saveData(this.postForm).then(() => {
        this.$notify({
          title: '成功',
          message: '考试保存成功！',
          type: 'success',
          duration: 2000
        })

        this.$store.dispatch('closeAndPushToView', { name: 'ExamManagementExam' })
      }).catch((reason) => {
        this.$notify({
          title: '保存考试数据失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },

    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
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


<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card style="margin-bottom: 10px">
          距离考试结束还有：<span style="color: #ff0000;">{{ min }}分钟{{ sec }}秒</span>
          <el-button
            style="float: right; margin-top: -10px"
            type="danger"
            icon="el-icon-check"
            :loading="loading"
            @click="handHandExam()"
          >
            {{ handleText }}
          </el-button>
        </el-card>
      </el-col>
      <el-col :span="6" :xs="24" style="margin-bottom: 10px">
        <el-card>
          <p class="card-title">答题卡</p>
          <el-row :gutter="24" class="card-line" style="padding-left: 10px">
            <el-tag type="info">未作答</el-tag>
            <el-tag type="success">已作答</el-tag>
            <el-tag type="warning">当前题</el-tag>
          </el-row>
          <div v-if="paperData.radioList!==undefined && paperData.radioList.length > 0">
            <p class="card-title">单选题</p>
            <el-row :gutter="24" class="card-line">
              <el-tag
                v-for="item in paperData.radioList"
                :key="item.id"
                :type="cardItemClass(item.answered, item.quId)"
                @click="handSave(item)"
              > {{ item.sort + 1 }}
              </el-tag>
            </el-row>
          </div>
          <div v-if="paperData.multiList!==undefined && paperData.multiList.length > 0">
            <p class="card-title">多选题</p>
            <el-row :gutter="24" class="card-line">
              <el-tag
                v-for="item in paperData.multiList"
                :key="item.id"
                :type="cardItemClass(item.answered, item.quId)"
                @click="handSave(item)"
              >{{ item.sort + 1 }}
              </el-tag>
            </el-row>
          </div>
          <div v-if="paperData.judgeList!==undefined && paperData.judgeList.length > 0">
            <p class="card-title">判断题</p>
            <el-row :gutter="24" class="card-line">
              <el-tag
                v-for="item in paperData.judgeList"
                :key="item.id"
                :type="cardItemClass(item.answered, item.quId)"
                @click="handSave(item)"
              >{{ item.sort + 1 }}
              </el-tag>
            </el-row>
          </div>
          <div v-if="paperData.saqList!==undefined && paperData.saqList.length > 0">
            <p class="card-title">简答题</p>
            <el-row :gutter="24" class="card-line">
              <el-tag
                v-for="item in paperData.saqList"
                :key="item.id"
                :type="cardItemClass(item.answered, item.quId)"
                @click="handSave(item)"
              >{{ item.sort + 1 }}
              </el-tag>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card class="qu-content">
          <el-row>
            <el-col :span="1">
              <el-tag type="primary">{{ quData.score }}分</el-tag>
            </el-col>
            <el-col :span="23">
              <el-input
                v-model="quData.quTitle"
                autosize
                type="textarea"
                resize="none"
                readonly
                style="margin-bottom: 20px"
              />
            </el-col>
          </el-row>
          <div v-if="quData.quType === 1 || quData.quType===3">
            <el-radio-group v-model="radioValue">
              <el-radio v-for="item in quData.answerList" :key="item.id" :label="item.id" @change="handNext()">
                {{ item.quContent }}
                <div v-if="item.image" style="clear: both" />
              </el-radio>
            </el-radio-group>
          </div>
          <div v-if="quData.quType === 2">
            <el-checkbox-group v-model="multiValue">
              <el-checkbox v-for="item in quData.answerList" :key="item.id" :label="item.id">
                {{ item.quContent }}
                <div v-if="item.image" style="clear: both" />
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-if="quData.quType === 4">
            <el-tag type="primary">答题：</el-tag>
            <el-input v-model="quData.answer" :autosize="{ minRows: 12, maxRows: 99}" type="textarea" />
          </div>
        </el-card>
        <div style="margin-top: 20px">
          <el-button v-if="showPrevious" type="primary" icon="el-icon-arrow-left" @click="handPrevious()">
            上一题
          </el-button>
          <el-button v-if="showNext" type="warning" @click="handNext()">
            下一题 <i class="el-icon-arrow-right el-icon--right" />
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        <video ref="videoCamera" :width="videoWidth" :height="videoHeight" autoplay style="float: right" />
        <canvas ref="canvasCamera" style="display:none;" width="640" height="480" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { paperDetail, quDetail, handExam, fillAnswer } from './exam'
import { Loading } from 'element-ui'
import { callCamera, closeCamera } from '@/utils/videoCamera'
import { controlCopy } from '@/utils/documentUtil'

export default {
  name: 'ExamOnlineDoExam',
  data() {
    return {
      // 全屏/不全屏
      isFullscreen: false,
      showPrevious: false,
      showNext: true,
      loading: false,
      handleText: '交卷',
      pageLoading: false,
      // 试卷ID
      paperId: '',
      // 当前答题卡
      cardItem: {},
      allItem: [],
      // 当前试题内容
      quData: {
        answerList: []
      },
      // 试卷信息
      paperData: {
        leftSeconds: 99999,
        radioList: [],
        multiList: [],
        saqList: [],
        judgeList: []
      },
      // 单选选定值
      radioValue: '',
      // 多选选定值
      multiValue: [],
      // 已答ID
      answeredIds: [],
      min: '00',
      sec: '00',
      videoWidth: 160,
      videoHeight: 120,
      cancasctx2d: {},
      cancasCamera: {},
      videoCamera: {}
    }
  },
  created() {
    const id = this.$route.params.id
    if (typeof id !== 'undefined') {
      this.paperId = id
      this.fetchData(id)
    }
    controlCopy(true)
  },
  beforeDestroy() {
    controlCopy(false)
    if (this.paperData.ssCount > 0) {
      window.onblur = () => {
      }
    }
    // 关闭摄像头
    if (this.paperData.photoFrequency > 0 && this.videoCamera) {
      closeCamera(this.videoCamera).then(() => {
      }).catch((reason) => {
        this.$notify({
          title: '关闭摄像头失败，关闭浏览器可以解决该问题！',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    }
  },
  methods: {
    // 倒计时
    countdown() {
      const leftSeconds = this.paperData.leftSeconds
      // 强制交卷
      if (leftSeconds < 0) {
        this.doHandler()
        return
      }
      // 时
      const min = parseInt(leftSeconds / 60)
      const sec = parseInt(leftSeconds % 60)
      this.min = min > 9 ? min : '0' + min
      this.sec = sec > 9 ? sec : '0' + sec
      const that = this
      this.paperData.leftSeconds -= 1
      setTimeout(function() {
        that.countdown()
      }, 1000)
    },
    // 答题卡样式
    cardItemClass(answered, quId) {
      if (quId === this.cardItem.quId) {
        return 'warning'
      }
      if (answered) {
        return 'success'
      }
      if (!answered) {
        return 'info'
      }
    },
    /**
     * 统计有多少题没答的
     * @returns {number}
     */
    countNotAnswered() {
      let notAnswered = 0
      this.paperData.radioList.forEach(function(item) {
        if (!item.answered) {
          notAnswered += 1
        }
      })
      this.paperData.multiList.forEach(function(item) {
        if (!item.answered) {
          notAnswered += 1
        }
      })
      this.paperData.judgeList.forEach(function(item) {
        if (!item.answered) {
          notAnswered += 1
        }
      })
      return notAnswered
    },

    /**
     * 下一题
     */
    handNext() {
      const index = this.cardItem.sort + 1
      if (index < this.allItem.length) {
        this.handSave(this.allItem[index])
      }
    },

    /**
     * 上一题
     */
    handPrevious() {
      const index = this.cardItem.sort - 1
      if (index >= 0) {
        this.handSave(this.allItem[index])
      }
    },

    doHandler() {
      this.handleText = '正在交卷，请等待...'
      this.loading = true
      const params = { id: this.paperId }
      handExam(params).then(() => {
        this.$message({
          message: '试卷提交成功，即将进入考试结果！',
          type: 'success'
        })
        this.$router.push({ name: 'ExamOnlineDoResult', params: { id: this.paperId + ',0' }})
      }).catch((reason) => {
        this.$notify({
          title: '交卷失败失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
        this.handleText = '再尝试交卷'
        this.loading = false
      })
    },
    // 交卷操作
    handHandExam() {
      const that = this
      // 交卷保存答案
      this.handSave(this.cardItem, function() {
        const notAnswered = that.countNotAnswered()
        let msg = '确认要交卷吗？'
        if (notAnswered > 0) {
          msg = '您还有' + notAnswered + '题未作答，确认要交卷吗?'
        }
        that.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.doHandler()
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '交卷已取消，您可以继续作答！'
          })
        })
      })
    },

    // 保存答案
    handSave(item, callback) {
      if (!item) {
        this.$message.error('下一题对象无效，系统出错，请联系管理员!')
        return
      }
      this.showPrevious = item.id !== this.allItem[0].id
      // 最后一个索引
      const last = this.allItem.length - 1
      this.showNext = item.id !== this.allItem[last].id
      const answers = this.multiValue
      if (this.radioValue !== '') {
        answers.push(this.radioValue)
      }
      if (this.quData.quType !== item.quType) {
        let notifyInfo = '单选题'
        if (item.quType === 2) {
          notifyInfo = '多选题'
        }
        if (item.quType === 3) {
          notifyInfo = '判断题'
        }
        if (item.quType === 4) {
          notifyInfo = '简答题'
        }
        notifyInfo = '注意：当前进入' + notifyInfo + '！'
        this.$message.warning(notifyInfo)
      }
      const params = {
        paperId: this.paperId,
        quId: this.quData.quId,
        answers: answers,
        answer: this.quData.answer,
        quType: this.quData.quType
      }
      fillAnswer(params).then(() => {
        // 必须选择一个值
        // 加入已答列表
        this.cardItem.answered = (answers.length > 0 || (this.quData.quType === 4 && this.quData.answer.length > 0))
        // 最后一个动作，交卷
        if (callback) {
          callback()
        }
        // 查找详情
        this.fetchQuData(item)
      }).catch((reason) => {
        this.$notify({
          title: '提交答案失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },

    // 试卷详情
    fetchQuData(item) {
      // 打开
      const loading = Loading.service({
        text: '拼命加载中',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      // 获得详情
      this.cardItem = item
      // 查找下个详情
      const params = { paperId: this.paperId, quId: item.quId }
      quDetail(params).then(response => {
        this.quData = response.data
        this.quData.quTitle = (this.quData.sort + 1) + '、' + this.quData.content
        this.radioValue = ''
        this.multiValue = []
        // 填充该试题的答案
        this.quData.answerList.forEach((item) => {
          if ((this.quData.quType === 1 || this.quData.quType === 3) && item.checked) {
            this.radioValue = item.id
          }
          if (this.quData.quType === 2 && item.checked) {
            this.multiValue.push(item.id)
          }
          item.quContent = item.abc + '、 【' + item.content + '】'
        })
        // 关闭详情
        loading.close()
      }).catch((reason) => {
        this.$notify({
          title: '获取试题失败',
          message: reason.message,
          type: 'error',
          duration: 5000
        })
      })
    },
    // 试卷详情
    fetchData(id) {
      const params = { id: id }
      paperDetail(params).then(response => {
        // 试卷内容
        this.paperData = response.data

        const that = this
        this.paperData.radioList.forEach(function(item) {
          that.allItem.push(item)
        })
        this.paperData.multiList.forEach(function(item) {
          that.allItem.push(item)
        })
        this.paperData.judgeList.forEach(function(item) {
          that.allItem.push(item)
        })
        this.paperData.saqList.forEach(function(item) {
          that.allItem.push(item)
        })
        // 获得第一题内容
        this.cardItem = this.allItem[0]
        // 当前选定
        this.fetchQuData(this.cardItem)
        // 倒计时
        this.countdown()
        // 开启摄像头
        if (this.paperData.photoFrequency > 0) {
          this.videoCamera = this.$refs['videoCamera']
          callCamera(this.videoCamera).then(value => {
            this.cancasCamera = this.$refs['canvasCamera']
            this.cancasctx2d = this.cancasCamera.getContext('2d')
          }).catch((reason) => {
            this.$notify({
              title: '摄像头开启失败，请检查摄像头是否可用！',
              message: reason.message,
              type: 'error',
              duration: 5000
            })
          })
        }
        // 切屏控制
        if (this.paperData.ssCount > 0) {
          window.onblur = () => {
            this.postRequest('gateway/exam/api/paper/paper/issCount/' + this.paperId).then(res => {
              const value = res.data
              if (value <= this.paperData.ssCount) {
                this.$notify({
                  title: '切屏警告',
                  message: '已切屏' + value + '次，只允许切屏' + this.paperData.ssCount + '次！！！',
                  type: 'warning',
                  duration: 60000
                })
              } else {
                this.$notify({
                  title: 'Game Over！！！',
                  message: '切屏' + value + '次超过总次数：' + this.paperData.ssCount + '次, 系统自动交卷!',
                  type: 'warning',
                  duration: 0
                })
                this.$router.push({ name: 'ExamOnlineDoResult', params: { id: this.paperId + ',0' }})
              }
            })
          }
          if (this.paperData.issCount > 0) {
            if (this.paperData.issCount <= this.paperData.ssCount) {
              this.$notify({
                title: '切屏警告',
                message: '已切屏' + this.paperData.issCount + '次，只允许切屏' + this.paperData.ssCount + '次！！！',
                type: 'warning',
                duration: 60000
              })
            } else {
              this.$notify({
                title: 'Game Over！！！',
                message: '切屏' + this.paperData.issCount + '次超过总次数：' + this.paperData.ssCount + '次, 系统自动交卷!',
                type: 'warning',
                duration: 0
              })
              this.$router.push({ name: 'ExamOnlineDoResult', params: { id: this.paperId + ',0' }})
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.qu-content div {
  line-height: 30px;
}

.el-checkbox-group label, .el-radio-group label {
  width: 100%;
}

.card-title {
  background: #eee;
  line-height: 35px;
  text-align: center;
  font-size: 14px;
}

.card-line {
  padding-left: 10px
}

.card-line span {
  cursor: pointer;
  margin: 2px;
}

/deep/
.el-radio, .el-checkbox {
  padding: 9px 20px 9px 10px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  margin-bottom: 10px;
}

.is-checked {
  border: #409eff 1px solid;
}

.el-radio img, .el-checkbox img {
  max-width: 200px;
  max-height: 200px;
  border: #dcdfe6 1px dotted;
}

/deep/
.el-checkbox__inner {
  display: none;
}

/deep/
.el-radio__inner {
  display: none;
}

/deep/
.el-checkbox__label {
  line-height: 30px;
}

/deep/
.el-radio__label {
  line-height: 30px;
}

@media print {
  body {
    display: none;
  }
}

/* 如果你的 el-input type 设置成textarea ，就要用这个了 */
.inputDeep >>> .el-textarea__inner {
  border: 0;
  resize: none; /* 这个是去掉 textarea 下面拉伸的那个标志，如下图 */
}
</style>


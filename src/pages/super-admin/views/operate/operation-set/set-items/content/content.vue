<template>
  <div class="table-wrap">
    <div class="table-name">{{ tableName }}</div>
    <hr class="mt-1 mb-5"/>
    <div ref="quesBox" id="quesBox" class="ques-box">
      <question-box
        :class="{'active': currInx === index}"
        v-for="(ques, index) in questions"
        :index="index"
        :title="ques.title"
        :options="ques.options"
        :key="'questions' + index">
        <template class="right" slot="right">
          <el-button v-show="currInx !== index" class="bg-green" type="text" @click="editQuestions(index)">编 辑</el-button>
          <el-button v-show="currInx !== index && onlineStatus !== '下线'" class="text-red" type="text" @click="delQuestions(index)">删 除</el-button>
        </template>
      </question-box>
      <transition name="el-zoom-in-top">
        <div ref="editBox" class="table-ques-edit" v-show="currInx !== -1">
          <el-form :model="ruleForm" ref="ruleForm" size="small">
            <el-form-item
              prop="title"
              :rules="{
                required: true, message: '题目不能为空', trigger: 'blur'
              }"
            >
              <el-input
                type="textarea"
                v-model="ruleForm.title"
                maxlength="100"
                rows="3"
                show-word-limit
                @input="quesTitleChange"
              >
              </el-input>
            </el-form-item>
            <div class="title">
              <div>选项文本</div>
              <div>分数</div>
              <div>允许填空</div>
              <div>操作</div>
            </div>
            <div
              class="option"
              v-for="(option, index) in ruleForm.options"
              :key="option.key">
              <el-form-item
                :prop="'options.'+ index + '.name'"
                :rules="{
                  required: true, message: '选项不能为空', trigger: 'blur'
                }">
                <el-input
                  v-model="option.name"
                  maxlength="100"
                  :placeholder="`选项${ index + 1 }`"
                  @input="e => option.name=e.replace(/\s/g,'')"
                  style="width: 250px;"
                >
                </el-input>
                <span class="ml-1">(最多100字)</span>
              </el-form-item>
              <el-form-item
                :prop="'options.'+ index + '.score'"
                :rules="{
                  required: true, message: '得分不能为空', trigger: 'blur'
                }">
                <el-input :disabled="onlineStatus === '下线'" v-model="option.score" @input="e => optionScoreChange(e, option)" maxlength="10" style="width: 100px;"></el-input>
              </el-form-item>
              <el-form-item>
                <el-checkbox :disabled="onlineStatus === '下线'" class="required" :value="option.requiredComment" @change="e => optionTextChange(e, option)"></el-checkbox>
                <el-checkbox :disabled="onlineStatus === '下线'" v-model="option.commentIsNecessary" :style="!option.requiredComment ? 'visibility: hidden;' : ''">必填</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-button v-show="ruleForm.options.length > 2 && onlineStatus !== '下线'" class="text-red" type="text" @click="removeOption(index)">删除</el-button>
              </el-form-item>
            </div>
            <el-button v-show="onlineStatus !== '下线'" class="btn-whole-dashed mt-1" @click="addOption()">+添加选项</el-button>
            <el-form-item class="mt-4 mb-0 text-right">
              <el-button class="bg-green" type="text" @click="resetForm('ruleForm')">取消</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </transition>
    </div>
    <div class="text-center my-5">
      <el-button v-show="onlineStatus !== '下线'" class="mr-5" type="success" plain @click="addQuestion">添加题目</el-button>
      <el-button v-show="onlineStatus !== '下线'" type="success" plain @click="addBatchQuestion">批量添加题目</el-button>
    </div>
    <hr v-if="configurationStatus"/>
    <div v-if="configurationStatus" class="text-center mt-5 mb-2">
      <el-button type="success" @click="save">保存</el-button>
    </div>
    <el-dialog
      custom-class="comment-hint-dialog"
      width="500px"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="commentHintVisible"
    >
      <div slot="title">
        说明文字
      </div>
      <div class="mt-3">
        <el-form
          ref="commentHintForm"
          class="mx-auto"
          :model="commentHintForm"
          style="width: 250px;"
          size="small"
        >
          <el-form-item
            prop="content"
            :rules="{
              required: true, message: '说明文字不能为空', trigger: 'blur'
            }"
          >
            <el-input v-model="commentHintForm.content" maxLength="10" @input="e => commentHintForm.content=e.replace(/\s/g,'')"></el-input>
            <p class="mb-0">(最多10字)</p>
          </el-form-item>
          <el-form-item class="text-center mt-5">
            <el-button type="success" plain @click="commentHintReset">取 消</el-button>
            <el-button type="primary" @click="commentHintSubmit">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <bulk-add :bulkAddVisible.sync="bulkAddVisible" @bulkAddEvent="bulkAddEvent"></bulk-add>
  </div>
</template>

<script>
import QuestionBox from '@/pages/super-admin/components/QuestionBox'
import BulkAdd from './bulk-add'
import { throttle } from '@/utils'
import { postTableQuestions } from '@/api/modules/operate'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ques-config',
  components: {
    QuestionBox,
    BulkAdd
  },
  data () {
    return {
      // 说明文字
      commentHintVisible: false,
      commentHintForm: {
        content: ''
      },
      // 批量添加
      bulkAddVisible: false,
      // 单题编辑
      currOption: null,
      editStatus: false,
      currInx: -1,
      questions: [],
      storeDomain: null,
      ruleForm: {
        title: '',
        options: []
      }
    }
  },
  computed: {
    ...mapState({
      configurationStatus: state => state.operate.configurationStatus === '已完成',
      tableCode: state => state.operate.tableCode,
      tableName: state => state.operate.tableName,
      questionsOld: state => state.operate.questions,
      configStep: state => state.operate.configStep,
      onlineStatus: state => state.operate.onlineStatus
    }),
    isChange () {
      console.log(this.questions.length !== this.questionsOld.length)
      if (this.questions.length !== this.questionsOld.length) return true
      for (const index in this.questions) {
        const newQues = this.questions[index]
        const oldQues = this.questionsOld[index]
        if (newQues.title !== oldQues.title) return true
        const newOptions = newQues.options
        const oldOptions = oldQues.form.formItems[0].options
        if (newOptions.length !== oldOptions.length) return true
        for (const oIndex in newOptions) {
          const newOption = newOptions[oIndex]
          const oldOption = oldOptions[oIndex]
          if (newOption.name !== oldOption.name) return true
          if (newOption.score !== oldOption.score) return true
          if (newOption.requiredComment !== oldOption.requiredComment) return true
          if (newOption.commentIsNecessary !== oldOption.commentIsNecessary) return true
          if (newOption.commentHint !== oldOption.commentHint) return true
        }
      }
      return false
    }
  },
  mounted () {
    if (this.configStep < 2) return
    this.questions = this.questionsOld.map(
      ques => {
        const { title, form } = ques
        const options = form.formItems[0].options
        return {
          title,
          options
        }
      }
    )
  },
  methods: {
    ...mapActions([
      'getTableInfo'
    ]),
    /**
     * 编辑题目区域
     */
    editQuestions (index) {
      if (this.editStatus) {
        this.$message({ type: 'error', message: '请先完成当前编辑内容' })
        return
      }
      this.editStatus = true
      this.storeDomain = this.questions[index]
      const item = {}
      item.title = this.storeDomain.title
      item.options = this.storeDomain.options.map(v => Object.assign({}, v))
      this.$set(this.questions, index, item)
      this.ruleForm = item
      this.currInx = index
      // 操作
      this.$nextTick(() => {
        const quesBox = this.$refs.quesBox
        const editBox = this.$refs.editBox
        quesBox.insertBefore(editBox, quesBox.childNodes[index + 1])
      })
    },
    delQuestions (index) {
      if (this.editStatus) {
        this.$message({ type: 'error', message: '请先完成当前编辑内容' })
        return
      }
      this.questions.splice(index, 1)
    },
    addQuestion () {
      if (this.editStatus) {
        this.$message({ type: 'error', message: '请先完成当前编辑内容' })
        return
      }
      this.editStatus = true
      const options = Array(4)
        .fill(0)
        .map(() => Object.assign({}, {
          name: '',
          score: 0,
          requiredComment: false,
          commentIsNecessary: false,
          commentHint: ''
        }))
      const item = {
        title: '',
        options
      }
      this.questions.push(item)
      this.ruleForm = item
      this.currInx = this.questions.length - 1
    },
    /**
     * 编辑题目选项区域
     */
    quesTitleChange (e) {
      this.ruleForm.title = e.replace(/\s/g, '')
      this.questions[this.currInx].title = this.ruleForm.title
    },
    removeOption (index) {
      this.ruleForm.options.splice(index, 1)
    },
    addOption () {
      this.ruleForm.options.push({
        name: '',
        score: 0,
        requiredComment: false,
        commentIsNecessary: false
      })
    },
    optionScoreChange (e, item) {
      const filterValue = e.replace(/[^\d]/g, '')
      item.score = +filterValue
    },
    optionTextChange (e, item) {
      // 勾选
      if (e) {
        this.commentHintVisible = true
        this.currOption = item
        return
      }
      item.requiredComment = e
      item.commentHint = ''
      item.commentIsNecessary = false
    },
    // 说明文字提交
    commentHintSubmit: throttle(function () {
      this.$refs.commentHintForm.validate(valid => {
        if (valid) {
          this.commentHintVisible = false
          this.currOption.commentHint = this.commentHintForm.content
          this.currOption.requiredComment = true
          this.commentHintForm.content = ''
          this.currOption = null
        }
      })
    }, 100),
    // 说明文字重置
    commentHintReset () {
      this.commentHintVisible = false
      this.commentHintForm.content = ''
      this.currOption = null
    },
    // 单题提交
    submitForm: throttle(function () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          console.log('submit')
          this.ruleForm = {
            title: '',
            options: []
          }
          this.currInx = -1
          this.editStatus = false
          // 编辑情况
          if (this.storeDomain) {
            this.storeDomain = null
            const quesBox = this.$refs.quesBox
            const editBox = this.$refs.editBox
            quesBox.appendChild(editBox)
          }
        }
      })
    }, 100),
    resetForm: throttle(function () {
      this.ruleForm = {
        title: '',
        options: []
      }
      const index = this.currInx
      this.questions.splice(index, 1)
      this.currInx = -1
      this.editStatus = false
      // 编辑情况,动画比移动慢（使用settimeout）
      setTimeout(() => {
        if (this.storeDomain) {
          this.questions.splice(index, 0, this.storeDomain)
          this.storeDomain = null
          const quesBox = this.$refs.quesBox
          const editBox = this.$refs.editBox
          quesBox.appendChild(editBox)
        }
      }, 0)
    }, 100),
    /**
     * 批量添加
     */
    // 打开批量添加窗口
    addBatchQuestion () {
      if (this.editStatus) {
        this.$message({ type: 'error', message: '请先完成当前编辑内容' })
        return
      }
      this.bulkAddVisible = true
    },
    bulkAddEvent (arr) {
      this.questions.push(...arr)
      this.bulkAddVisible = false
    },
    /**
     * 提交题目
     */
    // 保存
    save: throttle(function () {
      if (this.editStatus) {
        this.$message({ type: 'error', message: '您有正在编辑的题目' })
        return
      }
      if (this.questions.length === 0) {
        this.$message({ type: 'error', message: '请先添加题目' })
        return
      }
      const resJson = this.questions.map(v => {
        const form = {
          inline: false,
          formItems: []
        }
        form.formItems[0] = {
          type: 'radio',
          options: v.options
        }
        return {
          title: v.title,
          form
        }
      })
      postTableQuestions(this.tableCode, resJson).then(
        res => {
          this.getTableInfo(this.tableCode).then(
            () => {
              if (!this.configurationStatus) {
                setTimeout(() => {
                  this.$router.replace({
                    path: '/setting/set',
                    query: this.$route.query
                  })
                }, 1000)
              } else {
                this.$message({ type: 'success', message: '保存成功' })
              }
            }
          )
        }
      )
    }, 100)
  }
}
</script>

<style lang="less" scoped>
.table-wrap {
  width: 100%;
  max-width: 1280px;
  padding: 0 50px 50px 0;
  hr {
    border-top: 1px dashed #999999;
  }
  .table-name {
    width: 100%;
    font-size: 22px;
    font-weight: 700;
    color: #666666;
    text-align: center;
  }
}
.table-ques-edit {
  padding: 16px 36px;
  border: 1px solid #F2F2F2;
  background-color: #FBFBFB;
  /deep/.el-textarea__inner,
  /deep/.el-input__inner,
  .btn-whole-dashed {
    background-color: #FBFBFB;
  }
  .title {
    display: flex;
    padding: 0 20px;
    line-height: 50px;
    color: #8C8C8C;
    background: #EEEEEE;
    div:nth-child(1) {
      flex: 4;
    }
    div:nth-child(2) {
      flex: 2;
    }
    div:nth-child(3) {
      flex: 2;
    }
    div:nth-child(4) {
      flex: 1;
    }
  }
  .option {
    display: flex;
    padding: 8px 20px 0 20px;
    border-bottom: 1px solid #eee;
    .el-form-item {
      margin-bottom: 14px;
    }
    .el-form-item:nth-child(1) {
      flex: 4;
      span {
        font-size: 12px;
        color: #999999;
      }
    }
    .el-form-item:nth-child(2) {
      flex: 2;
    }
    .el-form-item:nth-child(3) {
      flex: 2;
    }
    .el-form-item:nth-child(4) {
      flex: 1;
    }
  }
  .required /deep/.el-checkbox__inner {
    width: 18px;
    height: 18px;
    &::after {
      top: 3px;
      left: 6px;
    }
  }
}
.ques-box /deep/.table-ques-examples {
  &.active {
    background-color: #FBFBFB;
  }
  &:hover {
    background-color: #FBFBFB;
    .right {
      visibility: visible;
    }
  }
  .right {
    text-align: right;
    visibility: hidden;
  }
}
/deep/.comment-hint-dialog {
  .el-dialog__header {
    padding: 16px 32px;
    line-height: 1;
    color: #34B7B9;
    font-size: 18px;
    font-weight: 700;
    border-bottom: 1px solid #EBEBEB;
  }
  .el-dialog__body {
    font-size: 12px;
    color: #999999;
    p {
      line-height: 1.5;
    }
  }
}
</style>

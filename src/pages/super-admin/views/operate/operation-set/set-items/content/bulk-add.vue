<template>
  <el-dialog
    title="批量添加题目"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="bulkAddVisible"
    @closed="bulkClose"
  >
    <div class="bulk-add">
      <ol class="tips">
        <li>题目与题目之间需空一行，题目不加题号，题干中间不得换行；</li>
        <li>题干与选项，及各选项之间需回车换行，选项不加序号；</li>
        <li>选项后括号内填写分数，分数使用英文括号。</li>
      </ol>
      <div class="content">
        <el-input id="bulkTextarea" type="textarea" v-model="bulkAddText" maxlength="10000" @input="view" @focus="bulkAddTextFocus"></el-input>
        <div ref="bulkRes" class="res">
          <QuestionBox
            v-for="(ques, index) in bulkAddQues"
            :index="index"
            :title="ques.title"
            :options="ques.options"
            :key="'QuestionBox' + index"/>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="success" size="small" plain @click="$emit('update:bulkAddVisible', false)">取 消</el-button>
      <el-button type="primary" size="small" @click="bulkAddSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { throttle, debounce } from '@/utils'
import QuestionBox from '@/pages/super-admin/components/QuestionBox'
export default {
  name: 'bulk-add',
  components: {
    QuestionBox
  },
  props: {
    bulkAddVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      bulkAddEditState: false,
      bulkAddText: '',
      bulkAddQues: [],
      bulkLeftScroll: null
    }
  },
  mounted () {
    this.bulkAddInt()
  },
  methods: {
    /**
     * 批量添加
     */
    // 批量添加初始化
    bulkAddInt () {
      this.bulkAddEditState = false
      this.bulkAddText = '题目1\n选项1(0)\n选项2(0)\n选项3(0)\n选项4(0)\n\n题目2\n选项1(0)\n选项2(0)\n选项3(0)\n选项4(0)'
      this.bulkAddQues = [{
        title: '题目1',
        options: [
          { name: '选项1', score: 0, requiredComment: false, commentIsNecessary: false, commentHint: '' },
          { name: '选项2', score: 0, requiredComment: false, commentIsNecessary: false, commentHint: '' },
          { name: '选项3', score: 0, requiredComment: false, commentIsNecessary: false, commentHint: '' },
          { name: '选项4', score: 0, requiredComment: false, commentIsNecessary: false, commentHint: '' }
        ]
      }, {
        title: '题目2',
        options: [
          { name: '选项1', score: 0, requiredComment: false, commentIsNecessary: false, commentHint: '' },
          { name: '选项2', score: 0, requiredComment: false, commentIsNecessary: false, commentHint: '' },
          { name: '选项3', score: 0, requiredComment: false, commentIsNecessary: false, commentHint: '' },
          { name: '选项4', score: 0, requiredComment: false, commentIsNecessary: false, commentHint: '' }
        ]
      }]
    },
    // 聚焦清空
    bulkAddTextFocus () {
      if (!this.bulkAddEditState) {
        this.bulkAddText = ''
        this.bulkAddQues = []
        this.bulkAddEditState = true
      }
    },
    // 窗口关闭
    bulkClose () {
      this.bulkAddInt()
      this.$emit('update:bulkAddVisible', false)
    },
    // 格式替换
    view: debounce(function (value) {
      this.bulkAddText = value.replace(' ', '').replace(/\n{3,}/g, '\n')
      // 去除开头结尾的多余换行符
      const text = this.bulkAddText.trim()
      // 拆分题目
      const quesArr = !text ? [] : text.split(/\n\n/)
      const questions = quesArr.map(ques => {
        const item = ques.split(/\n/)
        const [title, ...optionsArr] = item
        // 拆分选项
        const options = optionsArr.map(option => {
          const resMatch = option.match(/\(.+\)/)
          let name = ''
          let score = 0
          if (resMatch) {
            const res = resMatch[0]
            const index = resMatch.index
            name = option.slice(0, index)
            const scoreStr = res.slice(1, res.length - 1)
            score = isNaN(+scoreStr) ? 0 : +scoreStr
          } else {
            name = option
          }
          return {
            name,
            score,
            requiredComment: false,
            commentIsNecessary: false,
            commentHint: ''
          }
        })
        return { title, options }
      })
      this.bulkAddQues = questions
      this.$nextTick(() => {
        this.bulkScrollEvent()
      })
    }, 100),
    // 滚动事件
    bulkScrollEvent () {
      const bulkTextarea = document.querySelector('#bulkTextarea')
      const { scrollHeight, clientHeight } = bulkTextarea
      const { scrollHeight: resSH, clientHeight: resCH } = this.$refs.bulkRes
      // 右侧出现滚轮
      if (resSH > resCH) {
        // 左侧出现滚轮
        if (scrollHeight > clientHeight) {
          // 添加监听事件
          if (!this.bulkLeftScroll) {
            bulkTextarea.addEventListener('scroll', this.leftScrollListenter)
            this.$once('hook:beforeDestroy', () => {
              console.log('hook:beforeDestroy')
              bulkTextarea.removeEventListener('scroll', this.leftScrollListenter)
            })
            this.bulkLeftScroll = true
          }
        } else {
          this.$refs.bulkRes.scrollTop = resSH
        }
      }
    },
    // 左侧滚动监听
    leftScrollListenter: debounce(function (e) {
      this.$nextTick(() => {
        const { scrollHeight, clientHeight, scrollTop } = document.querySelector('#bulkTextarea')
        const { scrollHeight: resSH } = this.$refs.bulkRes
        if (scrollHeight - scrollTop - clientHeight < 10) {
          // 在底部打字或滚动
          this.$refs.bulkRes.scrollTop = resSH
        } else {
          // 其他位置打字或滚动
          const rare = scrollTop / scrollHeight
          this.$refs.bulkRes.scrollTop = this.$refs.bulkRes.scrollHeight * rare
        }
      })
    }, 100),
    // 批量添加题目
    bulkAddSubmit: throttle(function () {
      for (const i in this.bulkAddQues) {
        const { title, options } = this.bulkAddQues[i]
        let message = ''
        let error = false
        if (title.length > 100) {
          error = true
          message = `第${+i + 1}题题目长度超过100个字符`
        } else if (options.length < 2) {
          error = true
          message = `第${+i + 1}题选项个数少于2个`
        } else {
          for (const j in options) {
            const { name, score } = options[j]
            if (name.length > 100) {
              error = true
              message = `第${+i + 1}题存在选项长度超过100个字符`
            } else if (score.toString().length > 10) {
              error = true
              message = `第${+i + 1}题存在选项得分长度超过10个字符`
            } else if (
              score.toString().includes('.') ||
              score.toString().includes('-')
            ) {
              error = true
              message = `第${+i + 1}题选项得分格式错误`
            }
          }
        }
        if (error) {
          this.$message({ type: 'warning', message })
          return true
        }
      }
      this.$emit('bulkAddEvent', this.bulkAddQues)
    }, 100)
  }
}
</script>
<style lang="less" scoped>
.bulk-add {
  .tips {
    padding: 16px 20px 16px 40px;
    font-size: 14px;
    border: 1px dashed #707070;
    border-radius: 2px;
  }
  .content {
    display: flex;
    height: 400px;
    border: 1px solid #707070;
    &> div {
      flex: 1;
    }
    /deep/.el-textarea__inner {
      height: 100%;
      border-radius: 0;
      border: none;
      border-right: 1px solid #707070;
      resize: none;
    }
    .res {
      padding: 0 16px 16px 0;
      overflow-y: auto;
    }
  }
}
</style>

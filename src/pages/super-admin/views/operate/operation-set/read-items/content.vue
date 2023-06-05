<template>
  <div class="table-wrap">
    <div class="table-name">{{ tableName }}</div>
    <hr class="mt-1">
    <question-box
      v-for="(ques, index) in questions"
      :index="index"
      :title="ques.title"
      :options="ques.form.formItems[0].options"
      :key="'questions' + index">
    </question-box>
  </div>
</template>

<script>
import QuestionBox from '@/pages/super-admin/components/QuestionBox'
import { mapState } from 'vuex'
export default {
  name: 'self-content-detail',
  components: {
    QuestionBox
  },
  data () {
    return {
      // questions: [
      //   {
      //     title: '',
      //     form: {
      //       inline: false,
      //       formItems: [
      //         {
      //           type: 'radios',
      //           options: [
      //             {
      //               name: '',
      //               score: 0,
      //               requiredComment: false,
      //               commentIsNecessary: false
      //             }
      //           ]
      //         }
      //       ]
      //     }
      //   }
      // ]
    }
  },
  computed: {
    ...mapState({
      tableName: state => state.operate.tableName,
      questions: state => state.operate.questions
    })
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
</style>

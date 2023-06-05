<template>
  <div class="table-ques-examples">
    <div class="title">{{ index + 1 }}. {{ title || '题目' }}</div>
    <div class="ques-wrap">
      <div>
        <div
          class="ques-item"
          v-for="(item, itemInx) in options"
          :key="item.name + itemInx"
        >
          <span>{{ item.name || `选项${ itemInx + 1 }` }}</span>
          <span
            class="comment"
            :class="{'active': item.commentIsNecessary}"
            v-show="item.commentHint"
          >
            {{ item.commentHint }}
          </span>
          <span :class="{'input': item.requiredComment}"></span>
          <span class="score">({{ item.score }}分)</span>
        </div>
      </div>
      <div class="right" v-if="$slots.right">
        <slot name="right">
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'questions-box-01',
  props: {
    index: Number,
    title: String,
    options: {
      typeof: Array,
      default: () => []
    }
  }
}
</script>

<style lang="less" scoped>
.table-ques-examples {
  padding: 20px 36px;
  .title {
    line-height: 28px;
    font-weight: 700;
    color: #666666;
    word-break: break-all;
  }
  .ques-wrap {
    display: flex;
  }
  .right {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    flex: 1;
  }
  .ques-item {
    position: relative;
    min-height: 32px;
    line-height: 32px;
    margin-left: 24px;
    padding-left: 22px;
    font-size: 14px;
    color: #333;
    word-break: break-all;
    .score {
      margin-left: 10px;
      color: #34B7B9;
    }
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 7px;
      width: 18px;
      height: 18px;
      border: 1px solid #707070;
      border-radius: 50%;
    }
    .comment {
      position: relative;
      padding-left: 10px;
      padding-right: 4px;
      &.active::before {
        content: '*';
        position: absolute;
        left: 4px;
        color: red;
      }
    }
    .input {
      display: inline-block;
      width: 200px;
      height: 30px;
      margin-right: 10px;
      vertical-align: middle;
      border: 1px solid #ccc;
    }
  }
}
</style>

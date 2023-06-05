<template>
  <div class="alert-box">
    <div class="title" v-if="number || $slots.before">
      <div class="icon">i</div>
      <div class="text">
        <slot name="before">
          共{{ number }}条记录
        </slot>
      </div>
      <div><slot name="center"></slot></div>
    </div>
    <div class="buttons mr-3" v-if="$slots.after">
      <slot name="after"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlertBox',
  props: {
    number: Number
  },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.alert-box {
  display: flex;
  justify-content: space-between;
  height: 45px;
  background-color: rgba(75, 227, 207, .2);
  border: 2px solid rgba(53, 183, 185, .2);
  border-radius: 4px;
  box-sizing: border-box;
  .title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    line-height: 1;
    font-size: 14px;
  }
  .buttons {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .icon {
    height: 18px;
    width: 18px;
    margin-left: 24px;
    margin-right: 18px;
    text-align: center;
    color: #fff;
    font-weight: 700;
    line-height: 18px;
    background-color: #34B7B9;
    border-radius: 50%;
  }
  .text {
    color: #666;
  }
}
</style>

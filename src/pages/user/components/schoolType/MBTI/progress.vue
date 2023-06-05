<template>
  <div class="main">
    <div class="left">
      <el-progress :class="{'leftAfter': rightData >= 94,'maxAfter': rightData == 100}" :stroke-width="16" :percentage="rightData <= 6 ? 6 : rightData" :show-text="false"></el-progress>
    </div>
    <div class="right">
      <el-progress :stroke-width="16" :percentage="rightData" :show-text="false" ></el-progress>
    </div>
  </div>
</template>

<script>
export default {
  name: 'progress',
  props: {
    rightData: {
      type: String
    }
  }
}
</script>

<style lang="less">
.main{
  display: flex;
  align-items: center;
}
.el-progress{
  display: flex;
  align-items: center;
}
.el-progress-bar{
    width: 150px;
    .el-progress-bar__outer{
      border-radius: 4px;
      background-color: #f5f5f5;
      .el-progress-bar__inner{
        background: #34B7B9;
        border-radius: 4px;
      }
    }
}
.el-progress__text{
  font-size: 14px !important;
}
.left{
  display: flex;
  margin-right: 10px;
  .el-progress-bar__outer{
      border-radius: 6px 4px 4px 6px;
      overflow: unset;
      background-color: #34B7B9;
      .el-progress-bar__inner{
        background: #f5f5f5;
        border-radius: 4px;
        border: 1px solid #f5f5f5;
      }
      .el-progress-bar__inner::after{
            width: 16px;
            height: 16px;
            content: "";
            right: -7px;
            top: -1px;
            position: absolute;
            display: block;
            background: #34B7B9;
            border-radius: 4px;
      }
  }
  .leftAfter{
    .el-progress-bar__outer{
      border-radius: 6px;
    }
    .el-progress-bar__inner::after{
        // display: none;
        border-radius: 4px 2px 2px 4px;
        right: -2px;
        width: 4px;
    }
  }
  .maxAfter{
    .el-progress-bar__inner::after{
        display: none;
    }
  }
}
.right{
  display: flex;
  .prencent{
    font-size: 14px;
    color: #8C8C8C;
    display: inline-block;
    vertical-align: middle;
    margin-left: 5px;
  }
}
@media screen and (max-width: 576px) {
  .main{
    .el-progress-bar{
      width: 130px;
      padding: 0;
    }
  }
}
</style>

<template>
  <div class="mini">
    <!-- 第一个表 -->
    <div class="top-table" v-if="newScores">
      <div class="table-head same1 report-block">
        <div class="left">模块</div>
        <div class="right">
          <div class="top">
            <div class="sub-row">
              <div class="sub-left">项目</div>
              <div class="sub-right">
                <div class="right-row">
                  <div>时间范围</div>
                  <div>诊断</div>
                </div>
              </div>
            </div>
          </div>
          <div class="under" v-if="false">诊断</div>
        </div>
      </div>
      <div class="table-body same1 report-block" v-for="(it,index) in newScores" :key="index">
        <div class="left">{{it.topic}}</div>
        <div class="right">
          <div class="top" v-if="it.subTopicRes">
            <div class="sub-row" v-for="(item,ind) in it.subTopicRes" :key="ind">
              <div class="sub-left">{{item.subTopic}}</div>
              <div class="sub-right">
                <div class="right-row" v-for="(e,indexd) in item.slotRes" :key="indexd">
                  <div>{{e.slot}}</div>
                  <div>
                     <img v-if="e.res === '是'" src="@/assets/img/yes.png">
                     <span v-else-if="e.res === '否'"></span>
                     <span v-else>{{e.res}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="under" v-if="it.intro">{{it.intro}}</div>
        </div>
      </div>
      <div class="line report-block"></div>
    </div>
    <!-- 第二个表 心境障碍 -->
    <div class="center-table report-block" v-if="!newMoodDisorder.moodEmptyFlag">
      <div class="title">{{newMoodDisorder.topic}}</div>
      <div class="table-head same2">
        <div class="left">项目</div>
        <div class="right">
          <div class="right-row">
            <div class="sub-left">子项目</div>
            <div class="sub-right">
              <div class="row">
                <div>时间范围</div>
                <div>诊断</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="table-body same2" v-for="(it, index) in newMoodDisorder.refDiagnose" :key="index">
        <div class="left">{{it.topic}}</div>
        <div class="right">
          <div class="right-row" v-for="(item, ind) in it.subMoodDisorder" :key="ind">
            <div class="sub-left">{{item.subTopic}}</div>
            <div class="sub-right">
              <div class="row" v-for="(e,indexd) in item.slotRes" :key="indexd">
                <div>{{e.slot}}</div>
                <div>
                  <img v-if="e.res === '是'" src="@/assets/img/yes.png">
                  <span v-else-if="e.res === '否'"></span>
                  <span v-else>{{e.res}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 无心境障碍 -->
    <div class="fa-empty report-block"  v-if="newMoodDisorder.moodEmptyFlag">
      <div class="empty-table">
        <div class="title">{{newMoodDisorder.topic}}</div>
        <div class="text">{{newMoodDisorder.suppRes}}</div>
      </div>
    </div>
    <!-- 第三个表 -->
    <div class="under-table" v-if="newQAndA">
      <div class="table-head same3 report-block">
        <div class="left">模块</div>
        <div class="right">
          <div class="right-row">
            <div class="top">
              <div>问题</div>
              <div>用户回答</div>
            </div>
            <div class="under" v-if="false"></div>
          </div>
        </div>
      </div>
      <div class="table-body same3 report-block" v-for="(it, index) in newQAndA" :key="index">
        <div class="left">{{it.topic}}</div>
        <div class="right">
          <div class="right-row" v-for="(item, ind) in it.qAndAs" :key="ind">
            <div class="top">
              <div>{{item.question}}</div>
              <div>{{item.answer}}</div>
            </div>
            <div class="under" v-if="item.intro">{{item.intro}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Mini',
  props: {
    report: Object
  },
  data () {
    return {
      newScores: [],
      newQAndA: [],
      newMoodDisorder: {}
    }
  },
  created () {
    this.newScores = this.report.detail.miniReportDetail.newScores
    this.newMoodDisorder = this.report.detail.miniReportDetail.newMoodDisorder
    this.newQAndA = this.report.detail.miniReportDetail.newQAndA
  }
}
</script>

<style lang="less" scoped>
.mini{
  overflow-x: auto;
  .top-table{
    min-width: 400px;
    padding-bottom: 20px;
    .table-head{
      background: #D6E2EE;
      display: flex;
      border: 1px solid #707070;
      div{
        line-height: 32px;
        display: flex;
        justify-content: center;
      }
      .right{
        .top{
          .sub-row{
            border-bottom: none !important;
          }
        }
      }
    }
    .table-body{
      display: flex;
      border: 1px solid #707070;
    }
    .line{
      border-top: 1px solid #707070;
      height: 20px;
      width: 100%;
    }
    .same1{
      .left{
        flex: 3;
        min-width: 88px;
        display: flex;
        align-items: center;
        padding: 0 8px;
        margin-right: 0px;
      }
      .right{
        display: block;
        border-left: 1px solid #707070;
        flex: 7;
        min-width: 264px;
        .top{
          display: block;
          .sub-row{
            display: flex;
            border-bottom: 1px solid #707070;
            .sub-left{
              flex: 4;
              min-width: 88px;
              padding: 0 8px;
              border-right: 1px solid #707070;
              display: flex;
              align-items: center;
            }
            .sub-right{
              flex: 3;
              min-width: 176px;
              display: flex;
              flex-wrap: wrap;
              .right-row{
                display: flex;
                width: 100%;
                border-bottom: 1px solid #707070;
                div{
                  min-height: 32px;
                  padding: 0 8px;
                  display: flex;
                  align-items: center;
                }
                div:nth-child(1){
                  flex: 2;
                  min-width: 88px;
                  border-right: 1px solid #707070;
                }
                div:nth-child(2){
                  flex: 1;
                  min-width: 88px;
                  img{
                    width: 17px;
                    height: 13px;
                  }
                }
              }
              .right-row:last-child{
                border-bottom: none;
              }
            }
          }
          .sub-row:last-child{
            border-bottom: none;
          }
        }
        .under{
          min-height: 32px;
          border-top: 1px solid #707070;
          display: flex;
          align-items: center;
          padding: 0 8px;
          color: #999999;
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .center-table{
    min-width: 400px;
    padding-bottom: 20px;
    .title{
      height: 32px;
      background: #D6E2EE;
      border: 1px solid #707070;
      line-height: 32px;
      text-align: center;
    }
    .table-head{
      height: 32px;
      background: #D6E2EE;
      border: 1px solid #707070;
      .left{
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .right{
        .right-row{
          .sub-right{
            .row{
              div:last-child{
                justify-content: center;
              }
            }
          }
        }
      }
    }
    .same2{
      display: flex;
      border: 1px solid #707070;
      width: 100%;
      .left{
        flex: 3;
        min-width: 100px;
        padding: 0 8px;
        display: flex;
        align-items: center;
        margin-right: 0px;
        border-right: 1px solid #707070;
      }
      .right{
        display: block;
        flex: 8;
        .right-row{
          display: flex;
          border-bottom: 1px solid #707070;
          .sub-left{
            display: flex;
            flex: 3;
            min-width: 100px;
            min-height: 32px;
            align-items: center;
            padding: 0 8px;
          }
          .sub-right{
            flex: 5;
            display: flex;
            flex-wrap: wrap;
            .row{
              display: flex;
              margin: 0px;
              min-width: 200px;
              width: 100%;
              div{
                padding: 0 8px;
                min-height: 32px;
                align-items: center;
                border-bottom: 1px solid #707070;
              }
              div:nth-child(1){
               border-left: 1px solid #707070;
               border-right: 1px solid #707070;
               display: flex;
               align-items: center;
               min-width: 80px;
              }
              div:nth-child(2){
                flex: 4;
                min-width: 120px;
                width: 100%;
                display: flex;
                align-items: center;
                img{
                  width: 17px;
                  height: 13px;
                }
              }
            }
            .row:last-child{
              div{
                border-bottom: none;
              }
            }
          }
        }
        .right-row:last-child{
          border-bottom: none;
        }
      }
    }
  }
  .fa-empty{
    padding-bottom: 20px;
  }
  .empty-table{
    min-width: 400px;
    border: 1px solid #707070;
    .title{
      background: #D6E2EE;
      height: 32px;
      text-align: center;
      font-weight: 600;
      line-height: 32px;
      border-bottom: 1px solid #707070;
    }
    .text{
      min-height: 32px;
      display: flex;
      align-items: center;
    }
  }
  .under-table{
    min-width: 400px;
    padding-bottom: 20px;
    .table-head{
      height: 32px;
      color: #333333;
      background-color: #D6E2EE;
      border: 1px solid #707070;
    }
    .table-body{
      border: 1px solid #707070;
      min-height: 32px;
    }
    .same3{
      display: flex;
      .left{
        flex: 1;
        display: flex;
        align-items: center;
        margin-right: 0;
        min-width: 100px;
        padding: 0 8px;
        border-right: 1px solid #707070;
      }
      .right{
        flex: 8;
        display: block;
        min-width: 300px;
        .right-row{
          border-bottom: 1px solid #707070;
          .top{
            display: flex;
            div{
              min-height: 32px;
              padding: 0 8px;
              display: flex;
              align-items: center;
            }
            div:nth-child(1){
              flex: 5;
              min-width: 188px;
              border-right: 1px solid #707070;
            }
            div:nth-child(2){
              flex: 3;
              min-width: 112px;
            }
          }
          .under{
            padding: 0 8px;
            min-height: 32px;
            color: #999999;
            border-top: 1px solid #707070;
          }
        }
        .right-row:last-child{
          border-bottom: none
        }
      }
    }
  }
}
</style>

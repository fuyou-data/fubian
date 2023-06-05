<template>
  <div class="cattell-chart">
    <table cellspacing="0" cellpadding="0" border="0">
      <colgroup>
        <col width="108"/>
        <col width="115"/>
        <col width="50"/>
        <col width="50"/>
        <col width="50"/>
        <col width="50"/>
        <col width="50"/>
        <col width="50"/>
        <col width="50"/>
        <col width="50"/>
        <col width="50"/>
        <col width="50"/>
        <col width="115"/>
      </colgroup>
      <thead class="head">
        <tr>
          <th rowspan="2">人格因素</th>
          <th rowspan="2">低分特征</th>
          <th colspan="10">标准分</th>
          <th rowspan="2">高分特征</th>
        </tr>
        <tr>
          <th v-for="i in 10" :key="i + 'th'" data-round>{{i}}</th>
        </tr>
      </thead>
    </table>
    <div class="tbody" v-for="it in data" :key="it.personality">
      <div class="tb-cell" style="width: 108px">{{ it.personality }}</div>
      <div class="tb-cell" style="width: 115px">{{ it.lowScore }}</div>
      <div class="tb-cell round-in"><div class="round" data-index="1" :data-select="it.score === 1"></div></div>
      <div class="tb-cell round-in"><div class="round" data-index="2" :data-select="it.score === 2"></div></div>
      <div class="tb-cell round-in"><div class="round" data-index="3" :data-select="it.score === 3"></div></div>
      <div class="tb-cell round-in"><div class="round" data-index="4" :data-select="it.score === 4"></div></div>
      <div class="tb-cell round-in"><div class="round" data-index="5" :data-select="it.score === 5"></div></div>
      <div class="tb-cell round-in"><div class="round" data-index="6" :data-select="it.score === 6"></div></div>
      <div class="tb-cell round-in"><div class="round" data-index="7" :data-select="it.score === 7"></div></div>
      <div class="tb-cell round-in"><div class="round" data-index="8" :data-select="it.score === 8"></div></div>
      <div class="tb-cell round-in"><div class="round" data-index="9" :data-select="it.score === 9"></div></div>
      <div class="tb-cell round-in last"><div class="round" data-index="10" :data-select="it.score === 10"></div></div>
      <div class="tb-cell" style="width: 115px">{{ it.heightScore }}</div>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
      <line
        v-show="svgPos[i+1]"
        v-for="(item, i) in svgPos"
        :key="item" :x1="item.x"
        :y1="item.y"
        :x2="svgPos[i+1] ? svgPos[i+1].x : 0" :y2="svgPos[i+1] ? svgPos[i+1].y : 0"
        style="stroke:rgb(52, 183, 185);stroke-width:2"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'cattell-chart',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      svgPos: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      const items = document.querySelectorAll('[data-select="true"]')
      const itemMap = Array.from(items).map(v => {
        const CW = v.clientWidth
        const CH = v.clientHeight
        const OL = v.offsetLeft
        const OT = v.offsetTop
        return {
          x: OL + (CW / 2),
          y: OT + (CH / 2)
        }
      })
      this.svgPos = itemMap
    })
  }
}
</script>

<style lang="less" scoped>
.cattell-chart {
  width: 100%;
  overflow-x: inherit;
  position: relative;
  border-top: 1px solid gray;
  border-left: 1px solid gray;
  svg {
    width: 838px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  table {
    width: 838px;
    text-align: center;
    th {
      line-height: 30px;
      font-weight: 700;
      text-align: center;
      background-color: #D6E2EE;
      border-right: 1px solid gray;
      border-bottom: 1px solid gray;
      &[data-round]:not(:last-child) {
        border-right-color: #D6E2EE;
      }
    }
  }
  .tbody {
    display: flex;
  }
}
.round {
  width: 4px;
  height: 4px;
  background: #D6E2EE;
  border-radius: 50%;
  &[data-select="true"] {
    width: 8px;
    height: 8px;
    background: #34B7B9;
  }
}
.tb-cell {
  line-height: 30px;
  text-align: center;
  border-right: 1px solid gray;
  border-bottom: 1px solid gray;
  flex-shrink: 0;
  &.round-in {
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:not(.last) {
      border-right-color: #fff;
    }
  }
}
@media screen and (max-width: 500px) {
  .cattell-chart {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>

<template>
  <el-form class="public-form" :model="item" :rules="rules" ref="myform">
    <div class="row">
      <el-form-item label="年龄："  class="same" prop="age">
        <el-select v-model="item.age" size="small" class="se-big" @change="clearAge($event)">
          <el-option label="所有" value="所有"></el-option>
          <el-option label="区间" value="区间"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="age" v-if="item.age === '区间'" prop="minAge">
        <el-input @input="minAgeFilter($event)" v-model.number="item.minAge" class="small-input"  size="small"></el-input>
      </el-form-item>
      <el-form-item  v-if="item.age === '区间'" class="my-select" prop="minAgeOpt">
        <el-select v-model="item.minAgeOpt" size="small"  class="or-sm">
          <el-option label="大于等于" value=">="></el-option>
          <el-option label="大于" value=">"></el-option>
          <el-option label="等于" value="="></el-option>
        </el-select>
      </el-form-item>
      <span v-if="item.age === '区间'">年龄</span>
      <el-form-item v-if="item.age === '区间'" class="my-select" prop="maxAgeOpt">
        <el-select v-model="item.maxAgeOpt" size="small" class="or-sm">
          <el-option label="小于等于" value="<="></el-option>
          <el-option label="小于" value="<"></el-option>
          <el-option label="等于" value="="></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="age" v-if="item.age === '区间'" prop="maxAge">
        <el-input @input="maxAgeFilter($event)" v-model="item.maxAge" class="small-input"  size="small"></el-input>
      </el-form-item>
    </div>
    <div  class="row">
      <el-form-item label="性别：" class="same" prop="gender">
        <el-select v-model="item.gender" class="se-big" size="small">
          <el-option label="全部" value="全部"></el-option>
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
export default {
  props: {
    item: Object,
    index: Number,
    all: Array
  },
  data () {
    // 单个区间
    const checkMinAge = (rule, value, callback) => {
      if (this.item.maxAge && this.item.minAge) {
        if (this.item.minAgeOpt === '=') {
          if (this.item.maxAgeOpt !== '=') {
            return callback(new Error('请设置正确的范围'))
          } else if (+this.item.maxAge !== +this.item.minAge) {
            return callback(new Error('请设置正确的范围'))
          } else {
            return callback()
          }
        }
        if (this.item.maxAgeOpt === '=') {
          if (this.item.minAgeOpt !== '=') {
            return callback(new Error('请设置正确的范围'))
          } else if (+this.item.maxAge !== +this.item.minAge) {
            return callback(new Error('请设置正确的范围'))
          } else {
            return callback()
          }
        }
        if (this.item.minAgeOpt === '>=' && this.item.maxAgeOpt === '<=') {
          if (+this.item.minAge > +this.item.maxAge) {
            return callback(new Error('请设置正确的范围'))
          } else {
            return callback()
          }
        } else if (this.item.minAgeOpt === '>=' && this.item.maxAgeOpt === '<') {
          if (+this.item.minAge >= +this.item.maxAge) {
            return callback(new Error('请设置正确的范围'))
          } else {
            return callback()
          }
        } else if (this.item.minAgeOpt === '>' && this.item.maxAgeOpt === '<=') {
          if (+this.item.minAge >= +this.item.maxAge) {
            return callback(new Error('请设置正确的范围'))
          } else {
            return callback()
          }
        } else if (this.item.minAgeOpt === '>' && this.item.maxAgeOpt === '<') {
          if (+this.item.minAge >= +this.item.maxAge) {
            return callback(new Error('请设置正确的范围'))
          } else {
            return callback()
          }
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    }
    // checkMinAge有文案checkMinAgeOpt无文案checkMaxAgeOpt无文案checkMaxAge无文案
    const checkMinAgeOpt = (rule, value, callback) => {
      if (this.item.maxAge && this.item.minAge) {
        if (this.item.minAgeOpt === '=') {
          if (this.item.maxAgeOpt !== '=') {
            return callback(new Error(' '))
          } else if (+this.item.maxAge !== +this.item.minAge) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        }
        if (this.item.maxAgeOpt === '=') {
          if (this.item.minAgeOpt !== '=') {
            return callback(new Error(' '))
          } else if (+this.item.maxAge !== +this.item.minAge) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        }
        if (this.item.minAgeOpt === '>=' && this.item.maxAgeOpt === '<=') {
          if (+this.item.minAge > +this.item.maxAge) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        } else if (this.item.minAgeOpt === '>=' && this.item.maxAgeOpt === '<') {
          if (+this.item.minAge >= +this.item.maxAge) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        } else if (this.item.minAgeOpt === '>' && this.item.maxAgeOpt === '<=') {
          if (+this.item.minAge >= +this.item.maxAge) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        } else if (this.item.minAgeOpt === '>' && this.item.maxAgeOpt === '<') {
          if (+this.item.minAge >= +this.item.maxAge) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    }
    // 区间
    const checkAgeArea = (rule, value, callback) => {
      const arr = []
      this.all.forEach((e, ind) => {
        if (ind !== this.index && e.gender === this.item.gender && e.age === this.item.age && e.maxAge !== '' && e.minAge !== '' && this.item.maxAge !== '' && this.item.minAge !== '') {
          arr.push(e)
        }
      })
      // console.log(arr)
      let flag = false
      arr.forEach(e => {
        if (+e.maxAge < +this.item.minAge) {
          return
        }
        if ((+e.maxAge === +this.item.minAge) && ((e.maxAgeOpt === '<') || (this.item.minAgeOpt === '>'))) {
          return
        }
        if (+e.minAge > +this.item.maxAge) {
          return
        }
        if ((+e.minAge === +this.item.maxAge) && ((e.minAgeOpt === '>') || (this.item.maxAgeOpt === '<'))) {
          return
        }
        flag = true
      })
      if (flag) {
        return callback(new Error(' '))
      } else {
        return callback()
      }
    }
    // checkAgeArea有文案checkMinAgeOptArea无文案checkMaxAgeOptArea无文案checkMaxAgeArea无文案====其他
    const checkGenderArea = (rule, value, callback) => {
      const arr = []
      this.all.forEach((e, ind) => {
        if (ind !== this.index && e.gender === this.item.gender && e.age === this.item.age && e.maxAge !== '' && e.minAge !== '' && this.item.maxAge !== '' && this.item.minAge !== '') {
          arr.push(e)
        }
      })
      // console.log(arr)
      let flag = false
      arr.forEach(e => {
        if (+e.maxAge < +this.item.minAge) {
          return
        }
        if ((+e.maxAge === +this.item.minAge) && ((e.maxAgeOpt === '<') || (this.item.minAgeOpt === '>'))) {
          return
        }
        if (+e.minAge > +this.item.maxAge) {
          return
        }
        if ((+e.minAge === +this.item.maxAge) && ((e.minAgeOpt === '>') || (this.item.maxAgeOpt === '<'))) {
          return
        }
        flag = true
      })
      if (flag) {
        return callback(new Error('区间重叠'))
      } else {
        return callback()
      }
    }
    // -----------------------------------------------------------------------------------------------
    // 这是两个的区间
    const checkGenderAreaFirst = (rule, value, callback) => {
      const arr = []
      this.all.forEach((e, ind) => {
        if (ind !== this.index) {
          arr.push(e)
        }
      })
      let flag = false
      arr.forEach(e => {
        if (e.age === '所有' && (e.gender === '全部' || e.gender === '男' || e.gender === '女') && this.item.age === '所有' && this.item.gender === '全部') {
          flag = true
        }
        if (e.age === '所有' && e.gender === '全部' && this.item.age === '所有' && (this.item.gender === '全部' || this.item.gender === '女' || this.item.gender === '男')) {
          flag = true
        }
        if (e.age !== '' && e.gender === '全部' && this.item.age !== '' && this.item.gender !== '') {
          flag = true
        }
        if (e.age === '所有' && e.gender !== '' && this.item.age !== '' && this.item.gender !== '') {
          flag = true
        }
        if (e.age !== '' && e.gender !== '' && this.item.age === '所有' && this.item.gender !== '') {
          flag = true
        }
        if (e.age !== '' && e.gender !== '' && this.item.age !== '' && this.item.gender === '全部') {
          flag = true
        }
        if (e.age === '区间' && e.gender === '全部' && this.item.age === '区间' && this.item.gender === '全部') {
          flag = false
        }
        if (e.age === this.item.age && e.gender !== this.item.gender && e.gender !== '全部' && this.item.gender !== '全部') {
          flag = false
        }
      })
      if (flag) {
        return callback(new Error('区间重叠'))
      } else {
        return callback()
      }
    }
    const checkAgeAreaFirst = (rule, value, callback) => {
      const arr = []
      this.all.forEach((e, ind) => {
        if (ind !== this.index) {
          arr.push(e)
        }
      })
      let flag = false
      arr.forEach(e => {
        if (e.age === '所有' && (e.gender === '全部' || e.gender === '男' || e.gender === '女') && this.item.age === '所有' && this.item.gender === '全部') {
          flag = true
        }
        if (e.age === '所有' && e.gender === '全部' && this.item.age === '所有' && (this.item.gender === '全部' || this.item.gender === '女' || this.item.gender === '男')) {
          flag = true
        }
        if (e.age !== '' && e.gender === '全部' && this.item.age !== '' && this.item.gender !== '') {
          flag = true
        }
        if (e.age === '所有' && e.gender !== '' && this.item.age !== '' && this.item.gender !== '') {
          flag = true
        }
        if (e.age !== '' && e.gender !== '' && this.item.age === '所有' && this.item.gender !== '') {
          flag = true
        }
        if (e.age !== '' && e.gender !== '' && this.item.age !== '' && this.item.gender === '全部') {
          flag = true
        }
        if (e.age === '区间' && e.gender === '全部' && this.item.age === '区间' && this.item.gender === '全部') {
          flag = false
        }
        if (e.age === this.item.age && e.gender !== this.item.gender && e.gender !== '全部' && this.item.gender !== '全部') {
          flag = false
        }
      })
      if (flag) {
        return callback(new Error(' '))
      } else {
        return callback()
      }
    }
    return {
      rules: {
        age: [
          { validator: checkAgeAreaFirst, trigger: 'submit' },
          { validator: checkAgeArea, trigger: 'submit' }
        ],
        minAge: [
          { required: true, message: '输入不能为空', trigger: 'submit' },
          { validator: checkMinAge, trigger: 'submit' },
          { validator: checkAgeArea, trigger: 'submit' }
        ],
        minAgeOpt: [
          { validator: checkMinAgeOpt, trigger: 'submit' },
          { validator: checkAgeArea, trigger: 'submit' }
        ],
        maxAgeOpt: [
          { validator: checkMinAgeOpt, trigger: 'submit' },
          { validator: checkAgeArea, trigger: 'submit' }
        ],
        maxAge: [
          { required: true, message: '输入不能为空', trigger: 'submit' },
          { validator: checkMinAgeOpt, trigger: 'submit' },
          { validator: checkAgeArea, trigger: 'submit' }
        ],
        gender: [
          { validator: checkGenderAreaFirst, trigger: 'submit' },
          { validator: checkGenderArea, trigger: 'submit' }
        ]
      }
    }
  },
  methods: {
    check () {
      let flag = false
      this.$refs.myform.validate((valid) => {
        if (valid) {
          flag = true
          // console.log('姓名年龄ok')
        } else {
          // console.log('姓名年龄nook')
        }
      })
      return flag
    },
    clearAge (e) {
      if (e === '所有') {
        this.$emit('clearAge', this.index)
      }
    },
    minAgeFilter (e) {
      this.$emit('minAgeFilter', this.index, e)
    },
    maxAgeFilter (e) {
      this.$emit('maxAgeFilter', this.index, e)
    }
  }
}
</script>

<style lang="less" scoped>
.public-form{
  /deep/.same{
    margin-left: 100px;
    margin-right: 50px;
    display: flex;
  }
  /deep/.el-form-item__error{
    word-break: keep-all;
  }
  .my-select{
    margin: 0 10px;
  }
  /deep/.row{
    display: flex;
  }
  /deep/.small-input{
    width: 73px;
  }
  /deep/.or-sm{
    width: 108px;
  }
  /deep/.se-big{
    width: 240px;
  }
  span{
    line-height: 2.5;
    padding: 0 20px;
  }
}
</style>

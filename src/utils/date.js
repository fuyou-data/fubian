// /**
//  * 时间格式化
//  * @author linmiaomiao
//  */
// const getCurDate = (time, type = 2) => {
//   // type 3 = date 2 = minute 1 = second
//   const curTime = new Date(time * 1000)
//   const year = curTime.getFullYear()
//   const month = curTime.getMonth() + 1
//   const date = curTime.getDate()
//   const hour = curTime.getHours()
//   const minute = curTime.getMinutes()
//   const second = curTime.getSeconds()
//   let res // 默认
//   if (type <= 3 && type > 0) {
//     res = `${year}-${month > 9 ? month : '0' + month}-${date > 9 ? date : '0' + date}` // date
//   }
//   if (type <= 2 && type > 0) {
//     res += ` ${hour > 9 ? hour : '0' + hour}:${minute > 9 ? minute : '0' + minute}` // minute
//   }
//   if (type === 1) {
//     res += `:${second > 9 ? second : '0' + second}` // second
//   }
//   return res
// }

/**
 * 时间格式化-新
 * @author linmiaomiao
 */
const DateFormat = ({ date, type = 'default', format }) => {
  date = new Date(date)
  const masks = {
    default: 'yyyy-MM-dd hh:mm:ss',
    mediumDate: 'yyyy-MM-dd hh:mm',
    shortOnlyDate: 'yy-M-d',
    longOnlyDate: 'yyyy-MM-dd',
    shortTime: 'hh:mm',
    mediumTime: 'hh:mm:ss',
    ptTime: 'yyyy.MM.dd hh:mm:ss',
    dayTime: 'MM/dd'
  }
  let fmt = format || masks[type]
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3) // 季度
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp(`(${k})`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}
// const time = new Date()
// let time = '2020-12-12'
// console.log(DateFormat({ date: time }))

export {
  // getCurDate,
  DateFormat
}

// export risk
export function TypesMap (ele = []) {
  this.map = new Map(ele)
  this.toArray = () => {
    return Array.from(this.map)
  }
  this.getValue = (e) => {
    return this.map.get(e)
  }
  this.getKey = (e) => {
    let res = ''
    this.map.forEach((v, i) => { if (res === '' && v === e) res = i })
    return res
  }
}

export const logStatus = new TypesMap([[1, '上线'], [-1, '下线'], [2, '待审核']])

export const riskTypes = new TypesMap([[1, '低'], [2, '中'], [3, '中高'], [4, '高']])

export const systemTypes = ['呼吸系统', '泌尿系统', '免疫系统', '神经系统', '生殖系统', '消化系统', '循环系统', '运动系统', '内分泌系统', '其他']

export const roleStr = (val) => {
  if (val === 1) return '超级管理员'
  if (val === 2) return '运营'
  if (val === 3) return '市场'
  if (val === 4) return '外部用户'
  return val
}

export const mediaErrorTypes = (name) => {
  let errType = '摄像头或麦克风调用错误'
  switch (name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      errType = '用户已禁止网页调用摄像头或麦克风设备'
      break
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      errType = '摄像头或麦克风设备未找到'
      break
    case 'NotSupportedError':
      errType = '不支持摄像头或麦克风功能'
      break
  }
  return errType
}

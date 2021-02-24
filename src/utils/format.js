import moment from 'moment'
// 日期时间格式化
export function formartDate(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
}
// 将整数部分逢三一断
export function NumberFormat(value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  return intPartFormat
}
// 格式化query参数
export function formatUrlParams(url) {
  if (url.includes('?')) {
    let searchStr = url.split('?')[1]
    let parmasArr = searchStr.split('&')
    let parmas = {}
    parmasArr.forEach(item => {
      let key = item.split('=')[0]
      let value = item.split('=')[1]
      parmas[key] = value
    })
    return parmas
  }
}
// 数字转汉子
export function toChinesNum(numParmas) {
  let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  let unit = ['', '十', '百', '千', '万']
  let num = parseInt(numParmas)
  let getWan = temp => {
    let strArr = temp
      .toString()
      .split('')
      .reverse()
    let newNum = ''
    for (let i = 0; i < strArr.length; i++) {
      newNum =
        (i == 0 && strArr[i] == 0
          ? ''
          : i > 0 && strArr[i] == 0 && strArr[i - 1] == 0
          ? ''
          : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i])) + newNum
    }
    return newNum
  }
  let overWan = Math.floor(num / 10000)
  let noWan = num % 10000
  if (noWan.toString().length < 4) {
    noWan = '0' + noWan
  }
  return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
}
// 倒计时查看
export function diffDateStr(oldTime, newTime) {
  let diffTime = (new Date(newTime).getTime() - new Date(oldTime).getTime()) / 1000
  let d = Math.floor(diffTime / 86400)
  let h = Math.floor((diffTime - d * 86400) / 3600)
  let m = Math.floor((diffTime - d * 86400 - h * 3600) / 60)
  let s = Math.floor(diffTime - d * 86400 - h * 3600 - 60 * m)
  let diff_date_str = d + '天' + h + '时' + m + '分' + s + '秒'
  return diff_date_str
}

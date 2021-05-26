import moment from 'moment'
let timer
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
export function toChinesNum(money) {
  //汉字的数字
  var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖')
  //基本单位
  var cnIntRadice = new Array('', '拾', '佰', '仟')
  //对应整数部分扩展单位
  var cnIntUnits = new Array('', '万', '亿', '兆')
  //对应小数部分单位
  var cnDecUnits = new Array('角', '分', '毫', '厘')
  //整数金额时后面跟的字符
  var cnInteger = '整'
  //整型完以后的单位
  var cnIntLast = '元'
  //最大处理的数字
  var maxNum = 999999999999999.9999
  //金额整数部分
  var integerNum
  //金额小数部分
  var decimalNum
  //输出的中文金额字符串
  var chineseStr = ''
  //分离金额后用的数组，预定义
  var parts
  if (money == '') {
    return ''
  }
  money = parseFloat(money)
  if (money >= maxNum) {
    //超出最大处理数字
    return ''
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger
    return chineseStr
  }
  //转换为字符串
  money = money.toString()
  if (money.indexOf('.') == -1) {
    integerNum = money
    decimalNum = ''
  } else {
    parts = money.split('.')
    integerNum = parts[0]
    decimalNum = parts[1].substr(0, 4)
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0
    var IntLen = integerNum.length
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1)
      var p = IntLen - i - 1
      var q = p / 4
      var m = p % 4
      if (n == '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0]
        }
        //归零
        zeroCount = 0
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q]
      }
    }
    chineseStr += cnIntLast
  }
  //小数部分
  if (decimalNum != '') {
    var decLen = decimalNum.length
    for (var i = 0; i < decLen; i++) {
      var n = decimalNum.substr(i, 1)
      if (n != '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }
  if (chineseStr == '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (decimalNum == '') {
    chineseStr += cnInteger
  }
  return chineseStr
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
export function debounce(func, time) {
  let timer = null
  return function() {
    if (timer) {
      clearTimeout(timer)
    } else {
      timer = setTimeout(function() {
        func()
      }, time)
    }
  }
}
export function largeNumberSum(num1, num2) {
  let aStr = `${num1}`
  let bStr = `${num2}`
  let minStr,
    maxStr,
    sumStr = '',
    isCar = 0
  if (aStr.length < bStr.length) {
    minStr = aStr
    maxStr = bStr
  } else {
    minStr = bStr
    maxStr = aStr
  }
  let lengthNum = maxStr.length - minStr.length
  console.log(minStr, maxStr, lengthNum)
  for (let i = maxStr.length; i > 0; i--) {
    if (i > lengthNum) {
      console.log(i)
      let minIv = parseInt(minStr[i - lengthNum - 1]),
        maxIv = parseInt(maxStr[i - 1])
      if (isCar) {
        if (minIv + maxIv >= 9) {
          let val = minIv + maxIv - 9
          sumStr += val
          isCar = 1
        } else {
          let val = minIv + maxIv
          sumStr += val
          isCar = 0
        }
      } else {
        if (minIv + maxIv >= 10) {
          let val = minIv + maxIv - 10
          sumStr += val
          isCar = 1
        } else {
          sumStr += minIv + maxIv
          isCar = 0
        }
      }
    } else {
      console.log(i)
      let maxIv = parseInt(maxStr[i - 1])
      // console.log(maxIv)
      if (isCar) {
        if (maxIv >= 9) {
          let val = maxIv - 9
          sumStr += val
          isCar = 1
        } else {
          sumStr += maxIv
          isCar = 0
        }
      } else {
        sumStr += maxIv
        isCar = 0
      }
    }
  }
  return sumStr
    .split('')
    .reverse()
    .join('')
}

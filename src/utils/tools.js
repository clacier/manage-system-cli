// 数组去重
export function DeDuplication(arr = [], attribute) {
  if (attribute) {
    let arrData = []
    arr.forEach(item => {
      if (!arrData.includes(item[attribute])) {
        arrData.push(item)
      }
    })
    return arrData
  } else {
    return [...new Set(arr)]
  }
}

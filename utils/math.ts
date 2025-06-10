export function getFullNum(num: number) {
  //处理非数字
  if (isNaN(num)) {
    return num
  }
  //处理不需要转换的数字
  const str = '' + num
  if (!/e/i.test(str)) {
    return num
  }
  return num.toFixed(18).replace(/\.?0+$/, '')
}

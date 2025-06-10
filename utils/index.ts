import Graphemer from 'graphemer'
import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

const spliter = new Graphemer()
//将一个数字整数部分从后往前每三位用逗号分隔
export function formatNumber(num: number | string) {
  let str = num.toString()
  let newStr = ''
  let count = 0
  // 当数字是整数
  if (str.indexOf('.') == -1) {
    for (let i = str.length - 1; i >= 0; i--) {
      if (count % 3 == 0 && count != 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr
      }
      count++
    }
    str = newStr
    // + ".00" //自动补小数点后两位
    return str
  }
  // 当数字带有小数
  else {
    for (let i = str.indexOf('.') - 1; i >= 0; i--) {
      if (count % 3 == 0 && count != 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr //逐个字符相接起来
      }
      count++
    }
    str = newStr + (str + '00').substr((str + '00').indexOf('.'), 3)
    return str
  }
}

export function NoOperation() {}
export const getEllipsisStr = (str: string, prefixLength = 6, breakPoints = prefixLength + 4) => {
  let res = str
  const ellipsis = '...'
  if (str) {
    const splitStrList = spliter.splitGraphemes(str)
    const length = splitStrList.length
    if (length > breakPoints) {
      const prefix = splitStrList.slice(0, prefixLength)
      const suffix = splitStrList.slice(length - 4)
      res = `${prefix.join('')}${ellipsis}${suffix.join('')}`
    }
  }
  return res
}
export function formatSat(num: number) {
  const ONE_BTC = BigNumber.from('100000000')
  const ONE = BigInt('100000000')

  return formatUnits(parseUnits('' + num, 8).div(ONE_BTC), 8)
}

export function enFormatUnicode(str = ''): string {
  // After applying JSON.stringify, the result is '"str"'
  const newStr = JSON.stringify(str).replace('\\u0001', '')
  return JSON.parse(newStr)
}

export function formatCurrency(unit?: string | number) {
  if (!unit) return '0'
  let ans: string = '',
    current: number = 0,
    _unit: string[] = unit.toString().split('.')

  for (let i = _unit[0].length - 1; i >= 0; --i) {
    ans = _unit[0][i] + ans
    current++
    if (current === 3 && i) {
      current = 0
      ans = ',' + ans
    }
  }

  return ans + (_unit[1] ? '.' + _unit[1].slice(0, 3) : '')
}

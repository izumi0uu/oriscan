function zeroEllipsis(target: string) {
  if (!target || !target.includes('.')) return target
  let start = target.indexOf('.'),
    prev = target.slice(0, start),
    reset = target.slice(start),
    next = '',
    sub,
    count = ''
  if (reset.length > 3 && Number(target) > 0.001) return Number(target).toFixed(3)
  for (let i = start, len = target.length; i < len; ++i) {
    if (sub) {
      next += target[i]
    } else if (target[i] === '0') {
      count += '0'
    } else if (count.length >= 3) {
      prev += '0'
      sub = count.length
      next += target[i]
      count = ''
    } else {
      prev += target[i]
    }
  }
  return (
    <div className="inline-block">
      <span>{prev}</span>
      {sub && <sub>{sub}</sub>}
      <span>{sub ? next.slice(0, 2) : next}</span>
    </div>
  )
}

export { zeroEllipsis }
export default zeroEllipsis

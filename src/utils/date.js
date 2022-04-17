export function formatDate(date, fmt) {
  if (!date || date === '') {
    return date
  }
  if (typeof (date) === 'string' || typeof (date) === 'number') {
    date = new Date(date)
  }
  if (!(date instanceof Date) || (typeof (fmt) !== 'string')) {
    return date
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : str.padStart(2, '0'))
    }
  }
  return fmt
}


export function getDicData(data, keyName, keyValue) {
  // if (data && data instanceof Array && data.length > 0) {
  for (const dicDetail of data) {
    if (dicDetail[keyName] === keyValue) {
      return dicDetail
    }
  }
  // }
  return keyValue
}

export function getDicValue(data, keyName, keyValue, valueName) {
  const detail = getDicData(data, keyName, keyValue)
  if (typeof detail === 'object') {
    return detail[valueName]
  } else {
    return detail
  }
}

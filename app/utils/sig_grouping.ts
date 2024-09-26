import type { SigBody } from '~/types'

const sigGrouping = (sigObj: SigBody[]): SigBody[] => {
  let patternFlag = false
  const sigGroupResults: SigBody[] = []
  let patternGroup: SigBody[] = []
  let sigOrder = 1
  let patternGroupOrder = 1
  let patternOrder = 1
  sigObj.forEach((item) => {
    if (patternFlag === true) {
      if (item.propName === '--pattern' || item.propName === '--pcre') {
        sigGroupResults.push({
          propOrder: sigOrder++,
          propName: `PATTERN_GROUP_${patternGroupOrder++}`,
          propVal: patternGroup
        })
        patternGroup = []
        patternGroup.push({
          propOrder: patternOrder++,
          propName: item.propName,
          propVal: item.propVal
        })
      } else if (item.propName === '--context' || item.propName === '--no_case' || item.propName.startsWith('--distance') || item.propName.startsWith('--within')) {
        patternGroup.push({
          propOrder: patternOrder++,
          propName: item.propName,
          propVal: item.propVal ?? ''
        })
      } else {
        sigGroupResults.push({
          propOrder: sigOrder++,
          propName: `PATTERN_GROUP_${patternGroupOrder++}`,
          propVal: patternGroup
        })
        patternFlag = false
        patternGroup = []
        sigGroupResults.push({
          propOrder: sigOrder++,
          propName: item.propName,
          propVal: item.propVal
        })
      }
    } else {
      if (item.propName === '--pattern' || item.propName === '--pcre') {
        patternFlag = true
        patternGroup.push({
          propOrder: patternOrder++,
          propName: item.propName,
          propVal: item.propVal
        })
      } else if (item.propName === '--context' || item.propName === '--no_case' || item.propName.startsWith('--distance') || item.propName.startsWith('--within')) {
        sigGroupResults.push({
          propOrder: sigOrder++,
          propName: `WRONG_ORDER_${item.propName}`,
          propVal: item.propVal
        })
      } else {
        sigGroupResults.push({
          propOrder: sigOrder++,
          propName: item.propName,
          propVal: item.propVal
        })
      }
    }
  })
  if (patternFlag === true) {
    sigGroupResults.push({
      propOrder: sigOrder++,
      propName: `PATTERN_GROUP_${patternGroupOrder}`,
      propVal: patternGroup
    })
    patternFlag = false
    patternGroup = []
  }
  return sigGroupResults
}

export default sigGrouping

import type { SigBody } from '~/types'

const sigMaker = (sigObj: SigBody[]): string => {
  // F-SBID(SIGNATURE BODY)
  let signature = 'F-SBID('
  sigObj.forEach((obj, idx) => {
    if (Array.isArray(obj.propVal)) {
      obj.propVal.forEach((e) => {
        signature += (idx === 0 ? '' : ' ') + e.propName + (e.propVal !== '' ? ' ' : '') + e.propVal + ';'
      })
    } else {
      signature += (idx === 0 ? '' : ' ') + obj.propName + (obj.propVal !== '' ? ' ' : '') + obj.propVal + ';'
    }
  })
  signature += ')'
  return signature
}

export default sigMaker

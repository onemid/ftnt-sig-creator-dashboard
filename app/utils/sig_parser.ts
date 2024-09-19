import type { SigBody } from '~/types'

const extractSigBody = (signature: string): string => {
  // F-SBID(SIGNATURE BODY)
  let normalizedSignature = signature.trim()
  if (normalizedSignature.startsWith('F-SBID')) {
    normalizedSignature = normalizedSignature.slice(6)
  }
  normalizedSignature = normalizedSignature.trimStart()
  if (normalizedSignature.startsWith('(') && normalizedSignature.endsWith(')')) {
    normalizedSignature = normalizedSignature.slice(1, -1)
  }
  normalizedSignature = normalizedSignature.trim()
  return normalizedSignature
}

const sigParser = (signature: string): SigBody[] => {
  // F-SBID(SIGNATURE BODY)
  const sigBody = extractSigBody(signature)
  // Regular Expression break down: (--[A-Za-z\[\]\.\_\-0-9]+) *([^;]+)*;*
  const regex = /(--[A-Za-z[\]._\-0-9]+) *([^;]+)*;*/gm
  let m
  const sigBodyObject: SigBody[] = []
  let order = 0
  while ((m = regex.exec(sigBody)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }
    // The result can be accessed through the `m`-variable.
    let propName: string | null = null
    let propVal: string | null = null
    m.forEach((match, groupIndex) => {
      if (groupIndex === 1) {
        propName = match
      }
      if (groupIndex === 2) {
        propVal = match
      }
    })
    sigBodyObject.push({
      propOrder: ++order,
      propName: propName,
      propVal: propVal
    })
  }
  return sigBodyObject
}

export default sigParser

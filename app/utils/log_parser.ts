import type { FgtLog, FgtLogBody } from '~/types'

const logParser = (log: string): FgtLog => {
  // Regular Expression break down: (--[A-Za-z\[\]\.\_\-0-9]+) *([^;]+)*;*
  const regex = /([A-Za-z0-9]+) *= *("[^"]*"|[0-9:.-]+)*/gm
  let m
  const logBodyObject: FgtLogBody[] = []

  let eventtime: number | null = null
  let order = 0
  while ((m = regex.exec(log)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }
    // The result can be accessed through the `m`-variable.
    let propName: string | null = null
    let propVal: string | null = null
    let propString: string | null = null
    m.forEach((match, groupIndex) => {
      if (groupIndex === 0) {
        propString = match
      } else if (groupIndex === 1) {
        propName = match
      } else if (groupIndex === 2) {
        if (match.startsWith('"') && match.endsWith('"')) {
          propVal = match.slice(1, match.length - 1)
        } else {
          propVal = match
        }
      }
    })
    if (propName === 'eventtime') {
      eventtime = parseInt(propVal)
    }
    logBodyObject.push({
      propOrder: ++order,
      propName: propName,
      propVal: propVal,
      propSearch: null
    })
  }

  return {
    logOrder: -1,
    logTime: eventtime,
    log: logBodyObject
  }
}

export default logParser

import type { LimitedOptions } from '~/types'

const patternFields: LimitedOptions = {
  patterns: {
    limit: '',
    options: ['--pattern', '--pcre']
  },
  patternModifiers: {
    limit: '--pattern',
    options: ['--context', '--distance', '--within', '--no_case']
  },
  pcreModifiers: {
    limit: '--pcre',
    options: ['--context', '--distance', '--within']
  }
}

export default patternFields

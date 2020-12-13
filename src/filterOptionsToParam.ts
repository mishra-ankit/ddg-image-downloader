// import {ImageFilterOption} from './types'

const filterOptionsToParam = (options?: object): string => {
  const result: string[] = []
  if (!options) return ''
  const validOptions = ['size', 'type', 'layout', 'color']
  for (const [key, value] of Object.entries(options)) {
    if (value && validOptions.includes(key)) {
      result.push(`${key}:${value}`)
    }
  }
  return result.join(',')
}

export {filterOptionsToParam}

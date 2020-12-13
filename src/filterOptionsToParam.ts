import {ImageFilterOption} from './types'

const filterOptionsToParam = (options: ImageFilterOption): string => {
  const result: string[] = []
  for (const [key, value] of Object.entries(options)) {
    if (value) {
      result.push(`${key}:${value}`)
    }
  }
  return result.join(',')
}

export {filterOptionsToParam}

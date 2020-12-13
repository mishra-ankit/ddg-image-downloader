export function objToQueryString(params: any): string {
  return Object.keys(params).map(key => key + '=' + params[key]).join('&')
}


import fetch, {Response} from 'node-fetch'
import {fromBuffer} from 'file-type'

const fs = require('fs')

const downloadImage = async (url: string, path: string) => {
  // TODO: Can be other formats as well.
  const response: Response = await fetch(url)
  if (response.status !== 200) {
    throw new Error(`Failed image : ${path}. Status ${response.status} returned - ${url}`)
  }
  const buffer = await response.buffer()
  // TODO: and also content type ? If non image ?
  const {ext} = (await fromBuffer(buffer)) ?? {}
  if (!ext) {
    throw new Error(`Failed to identify image format : ${path}. Status ${response.status} returned - ${url}`)
  }
  const pathWithExtension = `${path}.${ext === 'xml' ? 'svg' : ext}`
  fs.writeFile(pathWithExtension, buffer, () => {
    // console.log('finished downloading!', path))
  })
}

export default downloadImage

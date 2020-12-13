import fetch, {Response} from 'node-fetch'
import {fromBuffer} from 'file-type'
import {writeFileSync} from 'fs'

const downloadImage = async (url: string, filePath: string) => {
  const response: Response = await fetch(url)
  if (response.status !== 200) {
    throw new Error(`Failed image : ${filePath}. Status ${response.status} returned - ${url}`)
  }
  const buffer = await response.buffer()
  // TODO: and also content type ? If non image ?
  const {ext} = (await fromBuffer(buffer)) ?? {}
  if (!ext) {
    throw new Error(`Failed to identify image format : ${filePath}. Status ${response.status} returned - ${url}`)
  }
  const pathWithExtension = `${filePath}.${ext === 'xml' ? 'svg' : ext}`
  writeFileSync(pathWithExtension, buffer)
}

export default downloadImage

import fetch, {Response} from 'node-fetch'
import downloadImage from './download-image'
import {ImageResponse, Options} from './types'
import * as path from 'path'
import {ensureDirSync} from 'fs-extra'

const ROOT_URL = 'https://duckduckgo.com'

async function getToken(query: string) {
  try {
    const response: any = await fetch(`${ROOT_URL}/?q=${encodeURIComponent(query)}`).then((t: Response) => t.text())
    const regex = /vqd='(.*?)'/gm
    const payload = regex.exec(response)
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return (payload as unknown as [])[1]
  } catch (error) {
    throw new Error('Failed to get token!' + error)
  }
}

async function downloadImages({
  query,
  limit,
  filter = () => true,
  fParams = 'size:small',
  outputPath = '',
}: Options) {
  const token = await getToken(query)
  const tokenSuffix = `&vqd=${token}`
  const url = `${ROOT_URL}/i.js?o=json&f=${fParams},type:photo&q=${encodeURIComponent(
    query,
  )}${tokenSuffix}`

  let response: ImageResponse | undefined

  // Ensure output folder is created
  ensureDirSync(outputPath)

  let count = 0
  let page = 1
  const failed: string[] = []
  while ((count - failed.length) < limit) {
    // console.log("Next:", response.next);
    let nextUrl: string = url
    if (response?.next) {
      console.log('Going to page', ++page)
      nextUrl = `${ROOT_URL}/${response.next}${tokenSuffix}`
    }
    response = (await fetch(nextUrl).then(t => t.json())) as ImageResponse

    const effectiveLimit = limit - (count - failed.length)

    const filteredImage = response.results.filter(filter).slice(0, effectiveLimit)

    // Method 1 : Doesn't uses parallel downloadImage capabilities, but ensures all files present.
    // for (let i = 0; i < filteredImage.length; i++) {
    //   try {
    //     await downloadImage(filteredImage[i].image, `${outputPath + query}_${count++}`)
    //   } catch (error) {
    //     count--
    //     console.error('FFFF', count)
    //   }
    // }
    // count += filteredImage.length

    // Method 2 : Could leave holes, when URl returns non success. But fast.
    await Promise.all(
      filteredImage.map(async (item: any) => {
        try {
          const savePath = path.join(outputPath, `${query}_${count++}`)
          // console.log(savePath)
          await downloadImage(item.image, savePath)
          // console.log("Success", count)
        } catch (error) {
          console.error(error.message)
          failed.push(error)
        } finally {
          // eslint-disable-next-line no-unsafe-finally
          return Promise.resolve()
        }
      }),
    )
  }
}

export {downloadImages}

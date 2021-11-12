import fetch, { Response } from 'node-fetch'
import downloadImage from './download-image'
import * as path from 'path'
import { ensureDirSync } from 'fs-extra'
import cli from 'cli-ux'

import { ImageResponse, Options } from './types'
import { objToQueryString } from './utils'
import { filterOptionsToParam } from './filterOptionsToParam'

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
  imageOptions,
  outputPath = '',
  debug,
}: Options) {
  cli.action.start('Initializing download', '', { stdout: true })

  const token = await getToken(query)
  const tokenQueryParamObj = { vqd: token };
  const queryParamString = objToQueryString({
    o: 'json',
    l: 'wt-wt',
    f: filterOptionsToParam(imageOptions),
    q: encodeURIComponent(query),
    ...tokenQueryParamObj,
  })
  const url = `${ROOT_URL}/i.js?${queryParamString}`

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
      ++page
      if (debug) {
        console.log('Going to page', page)
      }
      nextUrl = `${ROOT_URL}/${response.next}&${objToQueryString(tokenQueryParamObj)}`
    }
    console.log('Fetching', nextUrl);
    response = (await fetch(nextUrl).then(t => {
      console.log('Status', t.status);
      return t.json()
    }).catch(e => {
      console.error(e);
      return undefined;
    })) as ImageResponse
    const effectiveLimit = limit - (count - failed.length)
    const filteredImage = response.results.filter(filter)
    const toBeDownloadedImages = filteredImage.slice(0, Math.min(effectiveLimit, filteredImage.length))

    cli.action.start(`Downloading ${toBeDownloadedImages.length} images from`, 'page :' + page.toString(), { stdout: true })

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
      toBeDownloadedImages.map(async (item: any) => {
        try {
          const savePath = path.join(outputPath, `${query}_${count++}`)
          // console.log(savePath)
          await downloadImage(item.image, savePath)
          // console.log("Success", count)
        } catch (error) {
          if (debug) {
            console.error(error.message)
          }
          failed.push(error)
        } finally {
          // eslint-disable-next-line no-unsafe-finally
          return Promise.resolve()
        }
      }),
    )
  }

  cli.action.stop('done')
}

export { downloadImages }

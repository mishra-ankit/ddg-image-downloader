import fetch, {Response} from 'node-fetch'

const fs = require('fs')

const ROOT_URL = 'https://duckduckgo.com'

async function download(url: string, path: string) {
  // TODO: Can be other formats as well.
  const pathWithExtension = `${path}.jpg`
  const response = await fetch(url)
  // TODO: and also content type ? If non image ?
  // const {ext, mime} = await FileType.fromStream(response.data);
  // console.log(ext);

  if (response.status !== 200) {
    throw new Error(`Failed image : ${pathWithExtension}. Status ${response.status} returned - ${url}`)
  }
  const buffer = await response.buffer()
  fs.writeFile(pathWithExtension, buffer, () => {
    // console.log('finished downloading!', path))
  })
}

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

interface Options {
  query: string;
  limit: number;
  filter?: (image: Image) => boolean;
  fParams?: string;
  outputPath?: string;
}

interface Image {
  image: string;
}

interface ImageResponse {
  results: Image[];
  next: string;
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

  let count = 0
  let page = 1
  const failed: string[] = []
  while (count < limit) {
    // console.log("Next:", response.next);
    let nextUrl: string = url
    if (response?.next) {
      console.log('Going to page', ++page)
      nextUrl = `${ROOT_URL}/${response.next}${tokenSuffix}`
    }
    response = (await fetch(nextUrl).then(t => t.json())) as ImageResponse

    // console.log('Total count:', response.results.length)

    const effectiveLimit = limit - count

    const filteredImage = response.results.filter(filter).slice(0, effectiveLimit)

    // Method 1 : Doesn't uses parallel download capabilities, but ensures all files present.
    // for (let i = 0; i < filteredImage.length; i++) {
    //   try {
    //     await download(filteredImage[i].image, `${outputPath + query}_${count++}`)
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
          await download(item.image, `${outputPath + query}_${count++}`)
        } catch (error) {
          failed.push(error)
        } finally {
          // eslint-disable-next-line no-unsafe-finally
          return Promise.resolve()
        }
      }),
    )
  }
  console.error(failed.toString())
  console.log('Download Done!')
}

export {downloadImages}

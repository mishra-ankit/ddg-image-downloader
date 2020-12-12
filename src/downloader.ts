import axios from 'axios'
import fetch, {Response} from 'node-fetch'

const fs = require('fs')

const ROOT_URL = 'https://duckduckgo.com'

async function downloadImage(url: string, path: string) {
  // TODO: Can be other formats as well.
  const pathWithExtension = `${path}.jpg`
  // const {ext, mime} = await FileType.fromStream(response.data);
  // console.log(ext);

  const writer = fs.createWriteStream(pathWithExtension)

  const promise = new Promise(async (resolve, reject) => {
    let error: Error | null = null
    writer.on('error', (err: Error) => {
      error = err
      writer.close()
      reject(err)
    })
    writer.on('close', () => {
      if (!error) {
        console.log('Saved -', path)
        resolve(true)
      }
    })

    let response
    try {
      response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
      })
      response.data.pipe(writer)
    } catch (error2) {
      writer.close()
      if (fs.existsSync(pathWithExtension)) {
        fs.unlinkSync(pathWithExtension)
      }
      reject(error2)
      // eslint-disable-next-line no-console
      console.error('Failed -', error2.message, path, url)
    }
  })

  return promise
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
  while (count < limit) {
    // console.log("Next:", response.next);
    let nextUrl: string = url
    if (response?.next) {
      console.log('Next:', response.next)
      nextUrl = `${ROOT_URL}/${response.next}${tokenSuffix}`
    }
    response = (await axios(nextUrl)).data as ImageResponse

    console.log('Total count:', response.results.length)

    const effectiveLimit = limit - count

    const filteredImage = response.results.filter(filter).slice(0, effectiveLimit)
    await Promise.all(
      filteredImage.map(async (item: any) => {
        let t
        try {
          t = await downloadImage(item.image, `${outputPath + query}_${count++}`)
          //count++
        } catch (error) {
          console.error('FFFF', count)
          t = Promise.resolve()
        }

        return t
      }),
    )
    // count += filteredImage.length
  }
}

export {downloadImages}

import {Command, flags} from '@oclif/command'
import {downloadImages} from './downloader'
import {Color, Layout, Size, Type} from './types'
import {cli} from 'cli-ux'

class DdgBulkImageDownloader extends Command {
  static description = 'Lazy way to download images from Duck Duck Go search results in bulk'

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    query: flags.string({char: 'q', description: 'search query'}),
    limit: flags.integer({char: 'l', description: 'no of images to download', default: 10}),
    output: flags.string({char: 'o', description: 'output directory path'}),
    size: flags.enum({char: 's', options: Size}),
    type: flags.enum({char: 't', options: Type}),
    layout: flags.enum({char: 'l', options: Layout}),
    color: flags.enum({char: 'c', options: Color.slice(0, 4)}),
  }

  static args = [{name: 'query'}]

  // custom usage string for help
  // this overrides the default usage
  static usage = '"Morgan Freeman" --limit 50'

  // examples to add to help
  // each can be multiline
  static examples = [
    '$ ddg-download "Morgan Freeman"',
    '$ ddg-download -q "Morgan Freeman" -l 60 -o myOutput',
  ]

  async run() {
    const {flags, args} = this.parse(DdgBulkImageDownloader)

    const {query, limit, output, ...restParams} = flags
    let userQuery = args.query ?? query
    if (userQuery === undefined) {
      userQuery = await cli.prompt('What do you want to search for ?')
      if (userQuery === undefined) {
        this.error('No search term provided.')
        return
      }
    }
    // show on stdout instead of stderr

    await downloadImages({
      limit,
      query: userQuery,
      outputPath: output,
      imageOptions: restParams,
      debug: Boolean(this.config.debug),
    })
    // console.log(this.config)
    this.log(`Done! ${limit} images saved ${output ? `to folder '${output}'` : ''}`)
  }
}

export = DdgBulkImageDownloader

import {Command, flags} from '@oclif/command'
import {downloadImages} from './downloader'

class DdgBulkImageDownloader extends Command {
  static description = 'describe the command here'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'Duck Duck Go Bulk Downloader'}),
    query: flags.string({char: 'q', description: 'search query', required: true}),
    limit: flags.integer({char: 'l', description: 'limit', default: 10}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {flags} = this.parse(DdgBulkImageDownloader)

    const {query, limit} = flags
    this.log(`Searching for - ${query}`)
    await downloadImages({
      limit,
      query,
    })
  }
}

export = DdgBulkImageDownloader

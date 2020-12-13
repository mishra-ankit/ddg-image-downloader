ddg-bulk-image-downloader
=========================

Lazy way to download images from Duck Duck Go search results in bulk

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ddg-bulk-image-downloader.svg)](https://npmjs.org/package/ddg-bulk-image-downloader)
[![Downloads/week](https://img.shields.io/npm/dw/ddg-bulk-image-downloader.svg)](https://npmjs.org/package/ddg-bulk-image-downloader)
[![License](https://img.shields.io/npm/l/ddg-bulk-image-downloader.svg)](https://github.com/mishra-ankit/ddg-image-downloader/blob/master/package.json)

# Usage

```sh-session
$ npm install -g ddg-bulk-image-downloader
$ ddg-download "Morgan Freeman" -l 500 # Downloads first 500 images from Duck Duck go to current folder 
```

# Examples
```sh-session
$ ddg-download "Morgan Freeman"
$ ddg-download -q "Morgan Freeman" -l 60 -o myOutput
```

OPTIONS
```sh-session
-c, --color=(color|Monochrome|Red|Orange)
-h, --help                                  show CLI help
-l, --layout=(Square|Tall|Wide)
-l, --limit=limit                           [default: 10] no of images to download
-o, --output=output                         output directory path
-q, --query=query                           search query
-s, --size=(Small|Medium|Large|Wallpaper)
-t, --type=(photo|clipart|gif|transparent)
-v, --version                               show CLI version
```

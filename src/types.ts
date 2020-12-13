export interface Options {
  query: string;
  limit: number;
  filter?: (image: Image) => boolean;
  imageOptions?: object;
  outputPath?: string;
  debug: boolean;
}

export interface Image {
  image: string;
}

export interface ImageResponse {
  results: Image[];
  next: string;
}

export const Size = ['Small', 'Medium', 'Large', 'Wallpaper']
export const Type = ['photo', 'clipart', 'gif', 'transparent']
export const Layout = ['Square', 'Tall', 'Wide']
export const Color =
  ['color',
    'Monochrome',
    'Red',
    'Orange',
    'Yellow',
    'Green',
    'Blue',
    'Purple',
    'Pink',
    'Brown',
    'Black',
    'Gray',
    'Teal',
    'White']

// export type Size = 'Small' | 'Medium' | 'Large' | 'Wallpaper';
// export type Type = 'photo' | 'clipart' | 'gif' | 'transparent';
// export type Layout = 'Square' | 'Tall' | 'Wide';
// export type Color =
//   'color' |
//   'Monochrome' |
//   'Red' |
//   'Orange' |
//   'Yellow' |
//   'Green' |
//   'Blue' |
//   'Purple' |
//   'Pink' |
//   'Brown' |
//   'Black' |
//   'Gray' |
//   'Teal' |
//   'White'

// export interface ImageFilterOption {
//   size?: Size;
//   type?: Type;
//   layout?: Layout;
//   color?: Color;
// }

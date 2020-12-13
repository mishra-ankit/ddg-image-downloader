export interface Options {
  query: string;
  limit: number;
  filter?: (image: Image) => boolean;
  fParams?: string;
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

export interface ImageFilterOption {
  size?: 'Small' | 'Medium' | 'Large' | 'Wallpaper';
  type?: 'photo' | 'clipart' | 'gif' | 'transparent';
  layout?: 'Square' | 'Tall' | 'Wide';
  color?:
    'color' |
    'Monochrome' |
    'Red' |
    'Orange' |
    'Yellow' |
    'Green' |
    'Blue' |
    'Purple' |
    'Pink' |
    'Brown' |
    'Black' |
    'Gray' |
    'Teal' |
    'White';
}

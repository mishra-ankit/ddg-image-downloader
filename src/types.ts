export interface Options {
  query: string;
  limit: number;
  filter?: (image: Image) => boolean;
  fParams?: string;
  outputPath?: string;
}

export interface Image {
  image: string;
}

export interface ImageResponse {
  results: Image[];
  next: string;
}

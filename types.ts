export type WeavePattern = 'plain' | 'twill' | 'satin' | 'basket';

export interface ProcessorSettings {
  tileSize: number;
  horizontalShift: number;
  verticalShift: number;
  scatterIntensity: number;
  pattern: WeavePattern;
  opacity: number;
  seed: number;
}

export interface ImageDimensions {
  width: number;
  height: number;
}
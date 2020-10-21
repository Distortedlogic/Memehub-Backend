export const percent = (meme: any): number =>
  Math.round((meme.ups / (meme.ups + meme.downs + Number.EPSILON)) * 1000) /
  1000;

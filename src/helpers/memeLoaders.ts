import DataLoader from "dataloader";
import { Meme } from "./../models/meme/entities/Meme";

export const memeByIdLoader = () =>
  new DataLoader<string, Meme>(async (memeIds) => {
    const memes = await Meme.findByIds(memeIds as string[]);
    return memeIds.map((id) => memes.filter((user) => user.id === id)[0]);
  });

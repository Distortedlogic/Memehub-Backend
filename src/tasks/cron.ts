import schedule from "node-schedule";
import { recordRank } from "./rank/recordRank";
import { memeOCR } from "./tesseract";

export const StartCron = () => {
  schedule.scheduleJob({ minute: 0 }, recordRank);
  schedule.scheduleJob({ minute: 0 }, memeOCR);
};

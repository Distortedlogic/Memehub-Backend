import schedule from "node-schedule";
import { recordRank } from "./recordRank";

export const StartCron = () => {
  schedule.scheduleJob({ minute: 0 }, recordRank);
};

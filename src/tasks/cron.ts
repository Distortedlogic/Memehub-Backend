import schedule from "node-schedule";
import { claimAcct } from "./hive/claimAcct";
import { recordRank } from "./rank/recordRank";

export const StartCron = () => {
  schedule.scheduleJob({ minute: 0 }, claimAcct);
  schedule.scheduleJob({ minute: 0 }, recordRank);
};

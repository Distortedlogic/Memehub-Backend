import schedule from "node-schedule";
import { updateGasPrices } from "./gasPrices";
import { recordMarket } from "./recordMarket";

export const StartCron = () => {
  schedule.scheduleJob({ minute: 0, hour: 0 }, recordMarket);
  schedule.scheduleJob({ minute: 0, hour: 0 }, updateGasPrices);
};

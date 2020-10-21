import { Client } from "@hiveio/dhive";
export const createHiveConnection = async () => {
  let retries = 5;
  while (retries) {
    try {
      const hiveLive = new Client([
        "https://api.hivekings.com",
        "https://anyx.io",
        "https://api.openhive.network",
      ]);
      // const hiveTest = Client.testnet();
      // const hive = __prod__ ? hiveLive : hiveTest;
      hiveLive.database.getVersion().then((res) => {
        // @ts-ignore
        if (res.blockchain_version !== "0.23.0") {
          hiveLive.updateOperations(true);
        }
      });
      return hiveLive;
    } catch (error) {
      retries--;
      console.log("error", error);
      console.log("retries", retries);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  throw new Error("Exceeded connection retries");
};

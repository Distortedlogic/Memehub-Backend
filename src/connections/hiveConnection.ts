import { Client } from "@hiveio/dhive";
export const createHiveConnection = async () => {
  let retries = 5;
  while (retries) {
    try {
      // if (__prod__) {
      const hiveLive = new Client([
        "https://api.hivekings.com",
        "https://anyx.io",
        "https://api.openhive.network",
      ]);
      const res = await hiveLive.database.getVersion();
      // @ts-ignore
      if (res.blockchain_version !== "0.23.0") {
        hiveLive.updateOperations(true);
      }
      return hiveLive;
      // } else {
      //   const hiveTest = new Client(["http://127.0.0.1:32775"]);
      //   return hiveTest;
      // }
    } catch (error) {
      retries--;
      console.log("error", error);
      console.log("retries", retries);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  throw new Error("Exceeded connection retries");
};

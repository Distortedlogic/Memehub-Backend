import { Client } from "@hiveio/dhive";
// import { retry } from 'async-retry-decorator';

// const onRetry = (error:any, attempt:any) => {
//   console.log(`Retry (${attempt}) on error`, error.message);
// }

// @retry({retries: 5,onRetry})
async function createHiveConnection() {
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
}

export { createHiveConnection };

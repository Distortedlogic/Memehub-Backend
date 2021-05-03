import axios from "axios";
import { createRedisConnection } from "./../connections/redisConn";
// "https://ethgasstation.info/api/ethgasAPI.json?api-key="
export const updateGasPrices = async () => {
  const redis = await createRedisConnection();
  let retries = 0;
  while (retries < 5) {
    try {
      const resp = await axios.get(
        "https://data-api.defipulse.com/api/v1/egs/api/ethgasAPI.json?api-key=" +
          process.env.GAS_STATION_API_KEY
      );
      await redis.set("gasPrices", JSON.stringify(resp.data));
      break;
    } catch (error) {
      console.log("Gas Price Error");
      console.log(error);
      retries++;
    }
  }
};

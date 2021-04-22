import axios from "axios";
import { createRedisConnection } from "./../connections/redisConn";
export const updateGasPrices = async () => {
  const redis = await createRedisConnection();
  const resp = await axios.get(
    "https://ethgasstation.info/api/ethgasAPI.json?api-key=" +
      process.env.GAS_STATION_API_KEY
  );
  await redis.set("gasPrices", JSON.stringify(resp.data));
};

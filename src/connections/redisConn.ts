import Redis from "ioredis";
export const createRedisConnection = async () => {
  let retries = 5;
  while (retries) {
    try {
      const conn = new Redis(process.env.REDIS_URL);
      return conn;
    } catch (error) {
      retries--;
      console.log("error", error);
      console.log("retries", retries);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  throw new Error("Exceeded connection retries");
};

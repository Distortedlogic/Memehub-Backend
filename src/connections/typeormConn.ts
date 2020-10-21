import { createConnection } from "typeorm";
import { __prod__ } from "./../utils/constants";

console.log("dirname", __dirname);

export const createTypeormConnection = async () => {
  let retries = 5;
  while (retries) {
    try {
      await createConnection({
        type: "postgres",
        url: process.env.DATABASE_URL,
        synchronize: !__prod__,
        logging: false,
        entities: ["src/models/**/*.entity*.{js,ts}"],
        migrations: ["src/migration/**/*.{js,ts}"],
        subscribers: ["src/models/**/*.entity.sub*.{js,ts}"],
        cli: {
          entitiesDir: "src/entity",
          migrationsDir: "src/migration",
          subscribersDir: "src/subscriber",
        },
      });
      // await createConnection("memedata");
      // if (__prod__) await conn.runMigrations();
      return;
    } catch (error) {
      retries--;
      console.log("error", error);
      console.log("retries", retries);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  throw new Error("Exceeded connection retries");
};

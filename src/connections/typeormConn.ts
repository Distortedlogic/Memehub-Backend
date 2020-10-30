import { createConnection } from "typeorm";
import { __prod__ } from "./../utils/constants";

export const createTypeormConnection = async () => {
  let retries = 50;
  while (retries) {
    try {
      const conn = await createConnection({
        type: "postgres",
        url: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@sitedata:5432/${process.env.POSTGRES_DB}?sslmode=require`,
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
      if (__prod__) await conn.runMigrations();
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

import { secrets } from "docker-secret";
import { createConnection } from "typeorm";

const POSTGRES_USER = secrets.POSTGRES_USER || process.env.POSTGRES_USER;
const POSTGRES_DB = secrets.POSTGRES_DB || process.env.POSTGRES_DB;
const POSTGRES_PASSWORD =
  secrets.POSTGRES_PASSWORD || process.env.POSTGRES_PASSWORD;
const url = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@sitedata:5432/${POSTGRES_DB}?sslmode=require`;
export const createTypeormConnection = async () => {
  let retries = 50;
  while (retries) {
    try {
      const conn = await createConnection({
        type: "postgres",
        url,
        synchronize: false,
        logging: false,
        entities: ["src/models/**/entities/*.{js,ts}"],
        migrations: ["src/migration/**/*.{js,ts}"],
        subscribers: ["src/models/**/entities/*.sub*.{js,ts}"],
        cli: {
          entitiesDir: "src/entity",
          migrationsDir: "src/migration",
          subscribersDir: "src/subscriber",
        },
      });
      try {
        await conn.runMigrations();
      } catch (error) {
        throw new Error("migration error");
      }
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

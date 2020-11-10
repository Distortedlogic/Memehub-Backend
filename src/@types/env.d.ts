declare namespace NodeJS {
  export interface ProcessEnv {
    CORS_ORIGIN: string;
    SECRET: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;

    AWS_ID: string;
    AWS_KEY: string;
    EMAIL: string;
    EMAIL_PASSWORD: string;
  }
}

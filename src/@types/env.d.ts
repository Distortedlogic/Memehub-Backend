declare namespace NodeJS {
  export interface ProcessEnv {
    CORS_ORIGIN: string;
    SECRET: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    HIVE_ACCOUNT: string;
    ACTIVE_WIF: string;
    AWS_ID: string;
    AWS_KEY: string;
    SENDGRID_KEY: string;
  }
}

declare namespace NodeJS {
  export interface ProcessEnv {
    CORS_ORIGIN: string;
    HIVE_ACCOUNT: string;
    ACTIVE_WIF: string;
    RC_THRESHOLD: string;
    AWS_ID: string;
    AWS_KEY: string;
    SECRET: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
  }
}

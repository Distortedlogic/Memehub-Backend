declare namespace NodeJS {
  export interface ProcessEnv {
    CORS_ORIGIN: string;
    SECRET: string;
    HIVE_ACCOUNT: string;
    ACTIVE_WIF: string;
    AWS_ID: string;
    AWS_KEY: string;
    SENDGRID_KEY: string;
  }
}

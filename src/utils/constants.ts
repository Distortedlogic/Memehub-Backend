export const __prod__ = process.env.NODE_ENV === "production";
export const COOKIE_NAME = "speedCowOwen";
export const EMAIL = "noreply@memehub.lol";
export const BUCKET_BASE_URL = "https://memehub.s3.amazonaws.com/";

//switch between real and test community
export const HIVE_COMMUNITY = __prod__ ? "hive-189111" : "hive-119015";

// redis key prefixes
export const FORGOT_PASSWORD_PREFIX = "forgot-password:";
export const VERIFY_EMAIL_PREFIX = "verify-email:";

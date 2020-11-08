import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";

export const getHash = async (toBeHashed: string) =>
  await bcrypt.hash(toBeHashed, await bcrypt.genSalt(10));

export const encryptKey = (k: string, password: string) =>
  CryptoJS.AES.encrypt(k, password).toString();

export const decryptKey = (k: string, password: string) =>
  CryptoJS.AES.decrypt(k, password).toString(CryptoJS.enc.Utf8 as any);

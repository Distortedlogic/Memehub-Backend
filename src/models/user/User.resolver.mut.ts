import {
  Authority,
  CreateClaimedAccountOperation,
  cryptoUtils,
  PrivateKey,
  Signature,
} from "@hiveio/dhive";
import bcrypt from "bcryptjs";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { v4 } from "uuid";
import { ServerContext } from "../../ServerContext";
import {
  COOKIE_NAME,
  FORGOT_PASSWORD_PREFIX,
  __prod__,
} from "../../utils/constants";
import { sendEmail } from "../../utils/functions/sendEmail";
import { VERIFY_EMAIL_PREFIX } from "./../../utils/constants";
import { getKeys } from "./../../utils/functions/getKeys";
import { User } from "./User.entity";
import { validateLogin } from "./utils/login.validate";
import { validateRegister } from "./utils/register.validate";
import { UserResponse } from "./_types";

const currentCodes = ["LambdaDS8", "HiveMemes"];

@Resolver(User)
export class UserMutationResolver {
  @Mutation(() => UserResponse)
  async hiveLogin(
    @Ctx() { req: { session }, hive }: ServerContext,
    @Arg("username") username: string,
    @Arg("message") message: string,
    @Arg("signedMessage") signedMessage: string
  ): Promise<UserResponse> {
    const [account] = await hive.database.getAccounts([username]);
    let user = await User.findOne({ where: { username } });
    const pubPostingKey = account.posting.key_auths[0][0];
    const recoveredPubKey = Signature.fromString(signedMessage)
      .recover(cryptoUtils.sha256(message))
      .toString();
    if (pubPostingKey === recoveredPubKey) {
      if (!user) {
        // @ts-ignore
        let avatar = JSON.parse(account.posting_json_metadata).profile
          .profile_image;
        if (!avatar)
          avatar = JSON.parse(account.json_metadata).profile.profile_image;
        user = await User.create({
          username,
          avatar,
          isHive: true,
          verified: true,
        }).save();
      }
      session.userId = user.id;
      return { user };
    } else {
      return {
        errors: [
          {
            field: "Hive Key",
            message: "Authentication of Key Ownership Failed",
          },
        ],
      };
    }
  }

  @Mutation(() => UserResponse, { nullable: true })
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { req: { session } }: ServerContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { username } });
    if (!user?.verified)
      return {
        errors: [{ field: "verified", message: "please verify yourt email" }],
      };
    const errors = await validateLogin(user, password);
    if (errors) {
      return { errors };
    } else {
      session.userId = user!.id;
      return { user };
    }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: ServerContext): Promise<boolean> {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
  @Mutation(() => Boolean)
  async verifyCreationCode(@Arg("code") code: string): Promise<boolean> {
    if (currentCodes.includes(code)) return true;
    else return false;
  }

  @Mutation(() => Boolean)
  async createHiveAcct(
    @Ctx() { hive }: ServerContext,
    @Arg("new_account_name") new_account_name: string,
    @Arg("password") password: string
  ): Promise<boolean> {
    const keys = getKeys(new_account_name, password);
    const op: CreateClaimedAccountOperation = [
      "create_claimed_account",
      {
        active: Authority.from(keys.activePubkey),
        creator: process.env.HIVE_ACCOUNT!,
        extensions: [],
        json_metadata: JSON.stringify({
          app: "memehub:beta",
        }),
        memo_key: keys.memoPubkey,
        new_account_name,
        owner: Authority.from(keys.ownerPubkey),
        posting: Authority.from(keys.postingPubkey),
      },
    ];
    try {
      await hive.broadcast.sendOperations(
        [op],
        PrivateKey.from(process.env.ACTIVE_WIF!)
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  @Mutation(() => UserResponse)
  async register(
    @Ctx() { redis }: ServerContext,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("username") username: string
  ): Promise<UserResponse> {
    const errors = await validateRegister(username, email, password);
    if (errors) return { errors };
    const user = await User.create({
      username,
      email,
      password: await bcrypt.hash(password, await bcrypt.genSalt(10)),
    }).save();
    const token = v4();
    await redis.set(
      VERIFY_EMAIL_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 3
    );
    await sendEmail(
      email,
      "Verify Email for memehub.lol",
      `<a href="${
        __prod__ ? process.env.CORS_ORIGIN : "http://localhost:3000"
      }/verify-email/${token}"> Verify Email</a>`
    );
    return { user };
  }
  @Mutation(() => Boolean)
  async verifyEmail(
    @Ctx() { redis }: ServerContext,
    @Arg("token") token: string
  ): Promise<boolean> {
    const key = VERIFY_EMAIL_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) return false;
    await getConnection()
      .createQueryBuilder()
      .update<User>(User, {
        verified: true,
      })
      .where("users.id = :userId", { userId })
      .execute();
    await redis.del(key);
    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Ctx() { req, redis }: ServerContext,
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string
  ): Promise<UserResponse> {
    const key = FORGOT_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId)
      return { errors: [{ field: "newPassword", message: "bad token" }] };
    const user = (
      await getConnection()
        .createQueryBuilder()
        .update<User>(User, {
          password: await bcrypt.hash(newPassword, await bcrypt.genSalt(10)),
        })
        .where("user.id = :userId", { userId })
        .returning("*")
        .execute()
    ).raw[0];
    req.session.userId = user.id;
    await redis.del(key);
    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Ctx() { redis }: ServerContext,
    @Arg("email") email: string
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) return false;
    const token = v4();
    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 3
    );
    await sendEmail(
      email,
      "forgot Password",
      `<a href="${
        __prod__ ? process.env.CORS_ORIGIN : "http://localhost:3000"
      }/reset-password/${token}"> reset password</a>`
    );
    return true;
  }
}

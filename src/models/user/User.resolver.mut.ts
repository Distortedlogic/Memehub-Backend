import { cryptoUtils, Signature } from "@hiveio/dhive";
import bcrypt from "bcryptjs";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { v4 } from "uuid";
import { ServerContext } from "../../ServerContext";
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from "../../utils/constants";
import { sendEmail } from "../../utils/functions/sendEmail";
import { User } from "./User.entity";
import { validateLogin } from "./utils/login.validate";
import { validateRegister } from "./utils/register.validate";
import { UserResponse } from "./_types";

@Resolver(User)
export class UserMutationResolver {
  @Mutation(() => UserResponse)
  async changePassword(
    @Ctx() { req, redis }: ServerContext,
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string
  ): Promise<UserResponse> {
    const key = FORGOT_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId)
      return { errors: [{ field: "newPassword", message: "errors" }] };
    const user = (
      await getConnection()
        .createQueryBuilder()
        .update<User>(User, {
          password: await bcrypt.hash(newPassword, await bcrypt.genSalt(10)),
        })
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
      "NormieMailer@memehub.lol",
      email,
      "forgot Password",
      `<a href="http://127.0.0.1:3000/reset-password/${token}"> reset password</a>`
    );
    return true;
  }

  @Mutation(() => UserResponse)
  async register(
    @Ctx() { req }: ServerContext,
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
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async hiveLogin(
    @Ctx() { req: { session }, hive }: ServerContext,
    @Arg("username") username: string,
    @Arg("message") message: string,
    @Arg("signedMessage") signedMessage: string
  ): Promise<UserResponse> {
    const [account] = await hive.database.getAccounts([username]);
    const user = await User.findOne({ where: { username } });
    const pubPostingKey = account.posting.key_auths[0][0];
    const recoveredPubKey = Signature.fromString(signedMessage)
      .recover(cryptoUtils.sha256(message))
      .toString();
    if (pubPostingKey === recoveredPubKey) {
      if (!user) {
        const avatar = JSON.parse(account.json_metadata).profile.profile_image;
        const user = await User.create({
          username,
          avatar,
          isHive: true,
        }).save();
        session.userId = user.id;
        return { user };
      } else {
        session.userId = user.id;
        return { user };
      }
    } else return { errors: [{ field: "", message: "" }] };
  }

  @Mutation(() => UserResponse, { nullable: true })
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { req: { session } }: ServerContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { username } });
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
}

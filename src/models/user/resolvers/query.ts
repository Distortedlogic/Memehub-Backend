import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { ServerContext } from "../../../ServerContext";
import { User } from "../entities/User";

@Resolver(User)
export class UserQueryResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await User.find({ take: 20 });
  }

  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { req: { session } }: ServerContext
  ): Promise<User | undefined> {
    if (!session.userId) return;
    return User.findOne(session.userId);
  }
  @Query(() => User, { nullable: true })
  async user(@Arg("userId") userId: string): Promise<User | undefined> {
    return User.findOne(userId);
  }

  /**
   * Returns if account is a hive acct or not
   *
   * @param {ServerContext} { req: { session } }
   * @return {*}  {Promise<boolean>}
   * @memberof UserQueryResolver
   */
  @Query(() => Boolean)
  async isHive(@Ctx() { req: { session } }: ServerContext): Promise<boolean> {
    if (!session.userId) return false;
    const user = await User.findOne(session.userId);
    if (!user) {
      return false;
    }
    return user.isHive;
  }
}

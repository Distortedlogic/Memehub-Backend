import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { s3 } from "../../../connections/awsConnection";
import { Auth } from "../../../middleware/auth";
import { ServerContext } from "../../../ServerContext";
import { __prod__ } from "../../../utils/constants";
import { Meme } from "../entities/Meme";
import { MemeVote } from "../entities/MemeVote";

type s3ImgPaths = "memes" | "templates";

@Resolver(Meme)
export class MemeResolver {
  @Mutation(() => String)
  @UseMiddleware(Auth)
  async getSignedUrl(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("path") path: s3ImgPaths,
    @Arg("filename") filename: string
  ): Promise<string> {
    session.Key = `${__prod__ ? "memehub" : "local"}/${path}/${filename}`;
    return s3.getSignedUrlPromise("putObject", {
      Bucket: "memehub",
      Key: session.Key,
      ContentType: `image/${filename.split(".").pop()}`,
      Expires: 60,
      ACL: "public-read",
    });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async deleteMeme(
    @Ctx() { req: { session }, memehubId }: ServerContext,
    @Arg("memeId") memeId: string
  ): Promise<boolean> {
    const meme = await Meme.findOne(memeId);
    if (
      !meme ||
      (meme.userId !== session.userId && session.userId !== memehubId)
    )
      return false;
    const Key = meme.url.split("com")[1];
    try {
      await s3
        .deleteObject({
          Bucket: "memehub",
          Key: session.Key ? session.Key : Key,
        })
        .promise();
    } catch (error) {
      console.log(error);
    }
    await Meme.remove(meme);
    return true;
  }

  @Mutation(() => Meme, { nullable: true })
  @UseMiddleware(Auth)
  async postMeme(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("postToHive") postToHive: boolean,
    @Arg("title") title?: string
  ): Promise<Meme | undefined> {
    const { userId, Key } = session;
    if (!Key) return undefined;
    try {
      await s3
        .headObject({
          Bucket: "memehub",
          Key,
        })
        .promise();
    } catch (error) {
      return undefined;
    }
    const url = `https://memehub.s3.amazonaws.com/${Key}`;
    const meme = await Meme.create({
      url,
      title,
      userId,
      isHive: postToHive,
    }).save();
    session.Key = undefined;
    return meme;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(Auth)
  async setMemeIsHive(@Arg("memeId") memeId: string): Promise<boolean> {
    try {
      await getConnection()
        .createQueryBuilder()
        .update(Meme)
        .set({ isHive: true })
        .where("id = :id", { id: memeId })
        .execute();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @Mutation(() => Meme)
  @UseMiddleware(Auth)
  async upVoteMeme(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("memeId") memeId: string
  ): Promise<Meme | undefined> {
    const { userId } = session;
    if (await MemeVote.findOne({ where: { userId, memeId } })) return;
    await MemeVote.create({ upvote: true, userId, memeId }).save();
    return await Meme.findOne(memeId);
  }
  @Mutation(() => Meme)
  @UseMiddleware(Auth)
  async downVoteMeme(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("memeId") memeId: string
  ): Promise<Meme | undefined> {
    const { userId } = session;
    if (await MemeVote.findOne({ where: { userId, memeId } })) return;
    await MemeVote.create({ upvote: false, userId, memeId }).save();
    return await Meme.findOne(memeId);
  }
}

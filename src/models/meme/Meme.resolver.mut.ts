import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { Auth } from "../../middleware/auth";
import { ServerContext } from "../../ServerContext";
import { s3 } from "./../../connections/awsConnection";
import { __prod__ } from "./../../utils/constants";
import { Meme } from "./Meme.entity";
import { MemeVote } from "./MemeVote.entity";

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

  @Mutation(() => Meme, { nullable: true })
  @UseMiddleware(Auth)
  async postMeme(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("community") community: string,
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
    const meme = await Meme.create({
      url: `https://memehub.s3.amazonaws.com/${Key}`,
      title,
      userId,
      community,
    }).save();
    session.Key = null;
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

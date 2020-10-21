import AWS from "aws-sdk";
import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Auth } from "../../middleware/auth";
import { ServerContext } from "../../ServerContext";
import { Template } from "../template/Template.entity";
import { Meme } from "./Meme.entity";
import { MemeVote } from "./MemeVote.entity";

AWS.config.update({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_KEY,
});
const s3 = new AWS.S3();

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
    session.Key = `memehub/${path}/${filename}`;
    return await s3.getSignedUrlPromise("putObject", {
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
    @Ctx()
    { req: { session } }: ServerContext,
    @Arg("title", () => String) title?: string,
    @Arg("community", () => String) community?: string,
    @Arg("clanId", () => Int, { nullable: true }) clanId?: number,
    @Arg("templateName", { nullable: true }) templateName?: string
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
      clanId,
      season: 0,
    }).save();
    if (templateName) {
      await Template.create({
        name: templateName,
        baseMemeId: meme.id,
        season: 0,
      }).save();
    }
    session.Key = null;
    return meme;
  }

  @Mutation(() => Meme)
  @UseMiddleware(Auth)
  async upVoteMeme(
    @Ctx() { req: { session } }: ServerContext,
    @Arg("memeId", () => Int) memeId: number
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
    @Arg("memeId", () => Int) memeId: number
  ): Promise<Meme | undefined> {
    const { userId } = session;
    if (await MemeVote.findOne({ where: { userId, memeId } })) return;
    await MemeVote.create({ upvote: false, userId, memeId }).save();
    return await Meme.findOne(memeId);
  }
}

import { EntityRepository, getConnection, Repository } from "typeorm";
import { MemeVote } from "./MemeVote.entity";

@EntityRepository(MemeVote)
export class MemeRepo extends Repository<MemeVote> {
  async numUpvotesBetween(
    memeId: number,
    t1: string,
    t2?: string
  ): Promise<number> {
    const { count } = await getConnection()
      .getRepository(MemeVote)
      .createQueryBuilder("memevote")
      .select("COUNT(memevote.id)", "count")
      .where("memevote.memeId = :memeId", { memeId })
      .where("memevote.createdAt > :t1", { t1 })
      .where("memevote.createdAt < :t2", { t2 })
      .getRawOne();
    return count;
  }
}

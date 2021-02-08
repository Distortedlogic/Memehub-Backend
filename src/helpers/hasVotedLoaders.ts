import DataLoader from "dataloader";
import {
  CommentVote,
  commentVoteKey,
} from "../models/comment/entities/CommentVote";
import { MemeVote, memeVoteKey } from "../models/meme/entities/MemeVote";

export const commentDownVotedLoader = () =>
  new DataLoader<commentVoteKey, Boolean>(async (keys) => {
    const votes = await CommentVote.findByIds(keys as commentVoteKey[], {
      where: { upvote: false },
    });
    return keys.map(
      ({ commentId }) =>
        !!votes.filter((vote) => commentId === vote.commentId).length
    );
  });

export const commentUpVotedLoader = () =>
  new DataLoader<commentVoteKey, Boolean>(async (keys) => {
    const votes = await CommentVote.findByIds(keys as commentVoteKey[], {
      where: { upvote: true },
    });
    return keys.map(
      ({ commentId }) =>
        !!votes.filter((vote) => commentId === vote.commentId).length
    );
  });

export const memeDownVotedLoader = () =>
  new DataLoader<memeVoteKey, Boolean>(async (keys) => {
    const votes = await MemeVote.findByIds(keys as memeVoteKey[], {
      where: { upvote: false },
    });
    return keys.map(
      ({ memeId }) => !!votes.filter((vote) => memeId === vote.memeId).length
    );
  });

export const memeUpVotedLoader = () =>
  new DataLoader<memeVoteKey, Boolean>(async (keys) => {
    const votes = await MemeVote.findByIds(keys as memeVoteKey[], {
      where: { upvote: true },
    });
    return keys.map(
      ({ memeId }) => !!votes.filter((vote) => memeId === vote.memeId).length
    );
  });

import pino from "pino";

export const logger = pino(
  {
    prettyPrint: {
      crlf: false,
      errorLikeObjectKeys: ["err", "error"],
      levelFirst: true,
      messageKey: "msg",
      messageFormat: false,
      timestampKey: "time",
      translateTime: true,
      ignore: "pid,hostname",
    },
  },
  pino.destination(__dirname + "/logs/resolver.log")
);

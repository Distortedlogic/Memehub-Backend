interface mappedOrder {
  ups: "DESC";
  ratio: "DESC";
  createdAt: "DESC";
}

/**
 * Maps category to corresponding ordering for db query
 *
 * @param {string} order
 * @return {*}  {(mappedOrder | undefined)}
 */
export const ordermap = (order: string): mappedOrder | undefined => {
  switch (order) {
    case "new":
      return { createdAt: "DESC", ratio: "DESC", ups: "DESC" } as const;
    case "upvotes":
      return { ups: "DESC", ratio: "DESC", createdAt: "DESC" } as const;
    case "ratio":
      return { ratio: "DESC", ups: "DESC", createdAt: "DESC" } as const;
    default:
      return undefined;
  }
};

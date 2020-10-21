import {
  Asset,
  ClaimAccountOperation,
  Client,
  PrivateKey,
} from "@hiveio/dhive";

const hive = new Client([
  "https://api.hivekings.com",
  "https://anyx.io",
  "https://api.openhive.network",
]);
hive.database.getVersion().then((res) => {
  // @ts-ignore
  if (res.blockchain_version !== "0.23.0") {
    hive.updateOperations(true);
  }
});

export const claimAcct = async () => {
  console.log("Process Started ");
  console.log(
    "user: " +
      process.env.HIVE_ACCOUNT! +
      " - Thresold: " +
      process.env.RC_THRESHOLD!.toString()
  );
  const op: ClaimAccountOperation = [
    "claim_account" as const,
    {
      creator: process.env.HIVE_ACCOUNT!,
      fee: Asset.from("0.000 HIVE"),
      extensions: [],
    },
  ];

  try {
    const ac = await hive.call("rc_api", "find_rc_accounts", {
      accounts: [process.env.HIVE_ACCOUNT!],
    });
    if (ac.rc_accounts.length > 0) {
      const rc = Number(ac.rc_accounts[0].rc_manabar.current_mana);
      console.log(process.env.HIVE_ACCOUNT! + "'s RC is " + rc.toString());
      if (rc > parseInt(process.env.RC_THRESHOLD!) * 1000000000000) {
        try {
          const res = await hive.broadcast.sendOperations(
            [op],
            PrivateKey.from(process.env.ACTIVE_WIF!)
          );
          console.log(res);
          console.log("You have successfully claimed a discounted account");
        } catch (error) {
          console.log("broadcast error");
          console.log(error);
        }
      } else {
        console.log(
          `you are short ${
            parseInt(process.env.RC_THRESHOLD!) * 1000000000000 - rc
          } RC`
        );
      }
    }
  } catch (e) {
    console.log("couldnt get RC");
    console.log(e.message);
  }
};

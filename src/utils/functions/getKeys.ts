import { PrivateKey } from "@hiveio/dhive";
interface keys {
  owner: string;
  active: string;
  posting: string;
  memo: string;
  ownerPubkey: string;
  activePubkey: string;
  postingPubkey: string;
  memoPubkey: string;
}
export const getKeys = (username: string, password: string): keys => {
  const privKeys = {
    owner: PrivateKey.fromLogin(username, password, "owner").toString(),
    active: PrivateKey.fromLogin(username, password, "active").toString(),
    posting: PrivateKey.fromLogin(username, password, "posting").toString(),
    memo: PrivateKey.fromLogin(username, password, "memo").toString(),
    ownerPubkey: "",
    activePubkey: "",
    postingPubkey: "",
    memoPubkey: "",
  };
  privKeys.ownerPubkey = PrivateKey.from(privKeys.owner)
    .createPublic()
    .toString();
  privKeys.activePubkey = PrivateKey.from(privKeys.active)
    .createPublic()
    .toString();
  privKeys.postingPubkey = PrivateKey.from(privKeys.posting)
    .createPublic()
    .toString();
  privKeys.memoPubkey = PrivateKey.from(privKeys.memo)
    .createPublic()
    .toString();
  return privKeys;
};

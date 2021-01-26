import { Client } from "@elastic/elasticsearch";

export const elasticsearchConn = new Client({
  node: ["http://elasticsearch:9200"],
});

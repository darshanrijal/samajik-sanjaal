import { api } from "@/__rpc/server";

export default async function Home() {
  const res = await api.sayHi();
  return <div>{res}</div>;
}

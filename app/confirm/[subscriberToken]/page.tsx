import React, { use } from "react";
import Confirmation from "./Confirmation";
const Page = ({ params }: { params: Promise<{ subscriberToken: string }> }) => {
  const { subscriberToken } = use(params);
  return <Confirmation subscriberToken={subscriberToken} />;
};
export default Page;

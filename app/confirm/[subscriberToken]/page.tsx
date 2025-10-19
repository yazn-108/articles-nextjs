import dynamic from "next/dynamic";
import React, { use } from "react";
import PresentationalConfirmation from "./PresentationalConfirmation";
const Confirmation = dynamic(() => import("./Confirmation"), {
  loading: () => <PresentationalConfirmation responseMessage="جار التحقق..." />,
});
const Page = ({ params }: { params: Promise<{ subscriberToken: string }> }) => {
  const { subscriberToken } = use(params);
  return <Confirmation subscriberToken={subscriberToken} />;
};
export default Page;

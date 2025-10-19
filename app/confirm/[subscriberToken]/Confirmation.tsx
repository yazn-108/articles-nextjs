import React from "react";
import dynamic from "next/dynamic";
const PresentationalConfirmation = dynamic(
  () => import("./PresentationalConfirmation")
);
const Confirmation = async ({
  subscriberToken,
}: {
  subscriberToken: string;
}) => {
  const res = await fetch(`${process.env.url}/api/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: subscriberToken }),
    cache: "no-store",
  });
  const confirm = await res.json();
  return <PresentationalConfirmation responseMessage={confirm.message} />;
};
export default Confirmation;

import GoBackToHome from "@/app/_components/GoBackToHome";
import React from "react";
const Confirmation = async ({
  subscriberToken,
}: {
  subscriberToken: string;
}) => {
  let responseMessage = "جار التحقق...";
  const res = await fetch(`${process.env.url}/api/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: subscriberToken }),
    cache: "no-store",
  });
  const confirm = await res.json();
  responseMessage = confirm.message;
  return (
    <section className="min-h-dvh flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-2xl">حياك الله</h1>
        <h2 className="text-xl">{responseMessage}</h2>
        <GoBackToHome>
          <GoBackToHome.BackToHome />
        </GoBackToHome>
      </div>
    </section>
  );
};
export default Confirmation;

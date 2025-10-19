import GoBackToHome from "@/app/_components/GoBackToHome";
import React from "react";
const PresentationalConfirmation = ({
  responseMessage,
}: {
  responseMessage: string;
}) => {
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
export default PresentationalConfirmation;

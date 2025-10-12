import React from "react";
import SubscriptionFrom from "../_components/SubscriptionFrom/page";
import GoBackToHome from "../_components/GoBackToHome";
const page = () => {
  return (
    <div className="p-4">
      <GoBackToHome>
        <GoBackToHome.BackToHomeIcon />
      </GoBackToHome>
      <div className="min-h-[90dvh] flex items-center justify-center">
        <SubscriptionFrom />
      </div>
    </div>
  );
};
export default page;

import Link from "next/link";
import React from "react";
const GoBackToHome = ({ children }: { children: React.ReactNode }) => {
  return children;
};
GoBackToHome.BackToHome = function BackToHome() {
  return (
    <Link href={"/"} className="block mt-5 py-2 px-5 bg-primary rounded-md">
      العودة للصفحة الرئيسية
    </Link>
  );
};
GoBackToHome.BackToHomeIcon = function BackToHomeIcon() {
  return (
    <Link
      href={"/"}
      className="p-2 mb-5 bg-primary rounded-md inline-flex text-center justify-center"
    >
      <button className="cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
          />
        </svg>
      </button>
    </Link>
  );
};
export default GoBackToHome;

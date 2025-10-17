import React from "react";
const Skeleton = () => {
  return (
    <div className="py-10 px-4 space-y-5 animate-pulse">
      <div className="w-full h-80 bg-gray-700 rounded-2xl"></div>
      <div className="h-6 w-3/4 bg-gray-600 rounded"></div>
      <div className="h-4 w-full bg-gray-600 rounded"></div>
      <div className="h-4 w-5/6 bg-gray-600 rounded"></div>
    </div>
  );
};
export default Skeleton;

import React from "react";
import Articles from "./_Articles/Articles";
const page = () => {
  return (
    <div className="p-5 space-y-4">
      <h1 className="text-3xl md:text-4xl text-center font-bold">مُركَّز</h1>
      <p className="text-center text-xl md:text-2xl text-secondary max-w-4xl m-auto">
        مُركَّز منصة اجمع فيها مقالاتي التي تكون عبارة عن ملخص لمعلومة برمجية
        بدون كثرة مقدمات او تمطيط للكلام....
      </p>
      <Articles />
    </div>
  );
};
export default page;

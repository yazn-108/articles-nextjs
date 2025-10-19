import React from "react";
const ArticlesState = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};
ArticlesState.loading = function Loading() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-0 py-5 sm:p-5 gap-x-10 gap-y-16">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className={`space-y-4 animate-pulse ${
            index > 2 ? "hidden lg:block" : index > 0 ? "hidden md:block" : ""
          }`}
        >
          <div className="bg-gray-700 rounded-2xl w-full h-[300px] aspect-[16/9]"></div>
          <div className="flex justify-center items-center gap-5">
            <div className="bg-gray-600 h-4 w-20 rounded"></div>
            <div className="bg-gray-600 h-6 w-16 rounded-full"></div>
          </div>
          <div>
            <div className="bg-gray-600 h-6 w-3/4 mb-2 rounded"></div>
            <div className="bg-gray-600 h-4 w-full mb-1 rounded"></div>
            <div className="bg-gray-600 h-4 w-5/6 mb-1 rounded"></div>
            <div className="bg-gray-600 h-4 w-2/3 rounded"></div>
          </div>
        </div>
      ))}
    </section>
  );
};
ArticlesState.error = function Error() {
  return (
    <div className="p-5 space-y-4">
      <div className="min-h-[50dvh] flex justify-center items-center">
        <h2 className="text-xl text-destructive">حدث خطأ في تحميل المقالات</h2>
      </div>
    </div>
  );
};
ArticlesState.empty = function empty() {
  return (
    <section className="min-h-[50dvh] flex justify-center items-center">
      <h2 className="text-xl">لا يوجد مقالات بهذا الوسم...</h2>
    </section>
  );
};
export default ArticlesState;

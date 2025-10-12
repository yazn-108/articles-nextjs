import Link from "next/link";
import React from "react";
import GoBackToHome from "../_components/GoBackToHome";
const page = () => {
  return (
    <div className="p-5 space-y-4 min-h-dvh">
      <GoBackToHome>
        <GoBackToHome.BackToHomeIcon />
      </GoBackToHome>
      <section className="flex flex-col justify-center items-center gap-8">
        <header className="text-center space-y-4">
          <h2 className="text-primary text-2xl">شروط الاستخدام</h2>
          <p className="text-secondary font-bold">
            حياك الله في منصة مُركَّز. باستخدامك لهذا الموقع، فإنك توافق على
            الالتزام بالشروط التالية:
          </p>
        </header>
        <ol className="px-4 list-decimal space-y-3 max-w-4xl">
          <li>
            <strong className="text-primary">حقوق الملكية:</strong>
            <br />
            جميع المقالات والمحتوى الموجود على الموقع يهدف لإثراء المحتوى العربي
            بأبسط أسلوب، فيُسمح بنسخ أو إعادة نشر المحتوى بدون إذن صريح ولكن
            بشرط نسبة المحتوى المذكور إلى{" "}
            <Link
              target="_blank"
              href={"https://yazn-108.github.io/"}
              className="text-primary"
              dir="ltr"
            >
              @yazn_108
            </Link>{" "}
            بشكل صريح أو إلى من نسبت له المقالة.
          </li>
          <li>
            <strong className="text-primary">الاستخدام الشخصي فقط:</strong>
            <br />
            الموقع مخصص للاستخدام الشخصي والاطلاع على المقالات فقط. لا يُسمح
            باستخدام المحتوى لأغراض تجارية دون تصريح.
          </li>
          <li>
            <strong className="text-primary">عدم المسؤولية:</strong>
            <br />
            المقالات على الموقع لأغراض إعلامية أو تعليمية فقط. الموقع لا يتحمل
            أي مسؤولية عن أي أضرار أو نتائج قد تنتج عن استخدام المعلومات
            الواردة.
          </li>
          <li>
            <strong className="text-primary">
              التغييرات في المحتوى أو الشروط:
            </strong>
            <br />
            يحق لموقع مُركَّز تعديل المقالات أو شروط الاستخدام في أي وقت دون
            إشعار مسبق. استخدامك المستمر للموقع يعني قبولك للتغييرات.
          </li>
          <li>
            <strong className="text-primary">القانون المعمول به:</strong>
            <br />
            تخضع هذه الشروط وتفسر وفقًا لقوانين الدولة التي تقيم فيها.
          </li>
        </ol>
        <Link
          target="_blank"
          href={"https://yazn-108.github.io/"}
          className="bg-primary rounded-3xl py-2 px-4"
        >
          خذ نظرة على موقعي الشخصي
        </Link>
      </section>
    </div>
  );
};
export default page;

import React from "react";
import Link from "next/link";
import GoBackToHome from "../_components/GoBackToHome";
const page = () => {
  return (
    <div className="p-5 space-y-4 min-h-dvh">
      <GoBackToHome>
        <GoBackToHome.BackToHomeIcon />
      </GoBackToHome>
      <section className="flex flex-col justify-center items-center gap-4">
        <h2 className="text-primary text-2xl">من هو مطور المواقع يزن أحمد</h2>
        <p className="max-w-5xl leading-9">
          أنا يزن أحمد أو المعروف بـ
          <Link
            target="_blank"
            href={"https://yazn-108.github.io/"}
            className="text-primary"
          >
            yazn_108
          </Link>
          ، مطور مواقع من سوريا وأدرس كطالب هندسة كمبيوتر في جامعة اسطنبول GEDIK
          في تركيا أحاول تطوير نفسي في مجال تطوير واجهات المواقع من قرابة الـ4
          سنوات من أيام الثانوية، تعلمت بفضل الله عدة مهارات إن كانت تقنية تتعلق
          بالمجال أو مهارات عملية كالتواصل مع مختلف الناس بشكل احترافي. قمت
          بإنشاء هذه المنصة لأجمع فيها مقالاتي المبعثرة مابين قناتي على{" "}
          <Link
            target="_blank"
            href={"https://t.me/yazn108"}
            className="text-primary"
          >
            التلجرام
          </Link>{" "}
          وحسابي في{" "}
          <Link
            target="_blank"
            href={"https://x.com/yazn_108"}
            className="text-primary"
          >
            تويتر
          </Link>{" "}
          و
          <Link
            target="_blank"
            href={"https://www.linkedin.com/in/yazn-frontEnd/"}
            className="text-primary"
          >
            لينكيدان
          </Link>{" "}
          ولكن بطابعي الخاص الذي ركزت فيه على البساطة إن كان في نمط الكتابة أو
          شكل وتصميم الموقع وهذا هو الدافع الثاني لإنشاء المنصة هو أني وجدت أن
          جل إن لم يكن كل منصات المقالات وخلينا نتكلم على نطاق أو المستوى
          البرمجي تحتوي على مبالغات وتفاصيل مكررة يمكن الاستغناء عنها؛ فاتمنى ان
          تكون المنصة قد نالت على اعجابك وقبل هذا ان تكون قدمت اضافة او فائدة
          فعلية لك.
        </p>
        <Link
          target="_blank"
          href={"https://yazn-108.github.io/"}
          className="bg-primary rounded-3xl py-2 px-4"
        >
          معرض أعمالي
        </Link>
      </section>
    </div>
  );
};
export default page;

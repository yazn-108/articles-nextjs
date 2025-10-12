import React from "react";
import { Toaster } from "sonner";
interface PresentationalSubscriptionFromProps {
  NewsLetterEmail: React.RefObject<HTMLInputElement | null>;
  HandleNewsLetterEmail: () => void;
}
const PresentationalSubscriptionFrom: React.FC<
  PresentationalSubscriptionFromProps
> = ({ NewsLetterEmail, HandleNewsLetterEmail }) => {
  return (
    <div
      id="NewsLetter"
      className="mt-10 md:mt-0 text-center md:text-start order-2 md:order-1 md:max-w-xl lg:max-w-lg"
    >
      <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-foreground">
        اشترك في النشرة البريدية
      </h2>
      <p className="mt-4 text-lg text-secondary">
        ما راح أزعجك برسائل كثيرة، كل القصة إنك تحط بريدك عشان يوصلك تنبيه أول
        ما أنشر مقالات جديدة. بسيطة وسهلة 👌 أهلاً بك.
      </p>
      <div className="mt-6 flex gap-x-4 w-full md:max-w-md">
        <label htmlFor="email-address" className="sr-only">
          البريد الالكتروني
        </label>
        <input
          ref={NewsLetterEmail}
          id="email-address"
          name="email"
          type="email"
          placeholder="ادخل بريدك الالكتروني"
          autoComplete="email"
          className="w-full transition-all rounded-md bg-foreground/5 px-3.5 py-2 text-base text-foreground outline-1 -outline-offset-1 outline-foreground/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
        />
        <button
          onClick={HandleNewsLetterEmail}
          className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-foreground shadow-xs hover:bg-primary/35 outline-0 cursor-pointer transition-all"
        >
          اشترك
        </button>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};
export default PresentationalSubscriptionFrom;

import React from "react";
import { Toaster } from "sonner";
interface PresentationalContactFormProps {
  HandleContactForm: (e: React.FormEvent<HTMLFormElement>) => void;
  ContactMutation: { isPending: boolean };
}
const PresentationalContactForm: React.FC<PresentationalContactFormProps> = ({
  HandleContactForm,
  ContactMutation: { isPending },
}) => {
  return (
    <form onSubmit={HandleContactForm} className="order-1 md:order-2">
      <div className="mb-5">
        <input
          required
          type="text"
          placeholder="الاسم الكامل"
          autoComplete="false"
          className="w-full transition-all px-4 py-3 border-2 text-foreground rounded-md outline-none placeholder:text-gray-200 border-[#344157] focus:border-primary"
          name="name"
        />
      </div>
      <div className="mb-5">
        <label htmlFor="email_address" className="sr-only">
          البريد الالكتروني
        </label>
        <input
          required
          id="email_address"
          type="email"
          placeholder="البريد الالكتروني"
          autoComplete="false"
          className="w-full transition-all px-4 py-3 border-2 text-foreground rounded-md outline-none placeholder:text-gray-200 bg-gray-90 border-[#344157] focus:border-primary"
          name="email"
        />
      </div>
      <div className="mb-3">
        <textarea
          required
          placeholder="رسالتك"
          className="w-full transition-all px-4 py-3 border-2 text-foreground placeholder:text-gray-200 rounded-md outline-none h-36 border-[#344157] focus:border-primary"
          name="message"
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full transition-all cursor-pointer py-4 font-semibold rounded-md focus:outline-none px-7 bg-foreground hover:bg-foreground/35 hover:text-foreground text-black"
      >
        {!isPending ? "ارسل الرسالة" : "جاري الارسال..."}
      </button>
      <Toaster position="bottom-right" />
    </form>
  );
};
export default PresentationalContactForm;

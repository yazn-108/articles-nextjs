"use client";
import SubscriptionFrom from "./SubscriptionFrom/page";
import ContactForm from "./ContactForm/page";
const FooterForms = () => {
  return (
    <div className="justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 grid md:grid-cols-2 lg:grid-cols-2 gap-y-8 md:gap-x-8 md:gap-y-8 lg:gap-x-8 lg:gap-y-16">
      <SubscriptionFrom />
      <ContactForm />
    </div>
  );
};
export default FooterForms;

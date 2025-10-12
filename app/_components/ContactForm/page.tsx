import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React, { FormEvent } from "react";
import { toast } from "sonner";
import PresentationalContactForm from "./PresentationalContactForm";
const Page = () => {
  const ContactMutation = useMutation({
    mutationFn: ({
      email,
      name,
      message,
    }: {
      email: string;
      name: string;
      message: string;
    }) =>
      axios.post("/api/contact", {
        email,
        name,
        message,
      }),
    onError: (err: AxiosError) => {
      const data = err.response?.data as { message?: string };
      toast.error(data?.message);
    },
  });
  const HandleContactForm = (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    ContactMutation.mutate(
      {
        name: (form.elements.namedItem("name") as HTMLInputElement)?.value,
        email: (form.elements.namedItem("email") as HTMLInputElement)?.value,
        message: (form.elements.namedItem("message") as HTMLTextAreaElement)
          ?.value,
      },
      {
        onSuccess: () => {
          toast.success("تم ارسال الرسالة بنجاح!");
          form.reset();
        },
      }
    );
  };
  return (
    <PresentationalContactForm
      ContactMutation={ContactMutation}
      HandleContactForm={HandleContactForm}
    />
  );
};
export default Page;

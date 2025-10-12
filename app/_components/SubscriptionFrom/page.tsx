"use client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React, { useRef } from "react";
import { toast } from "sonner";
import PresentationalSubscriptionFrom from "./PresentationalSubscriptionFrom";
const Page = () => {
  const NewsLetterEmail = useRef<HTMLInputElement>(null);
  const subscribeMutation = useMutation({
    mutationFn: (email: string) =>
      axios.post("/api/subscribe", {
        email,
      }),
    onSuccess: (res) => {
      toast.success(res.data.message);
      const email = NewsLetterEmail.current;
      if (email) email.value = "";
    },
    onError: (err: AxiosError) => {
      const data = err.response?.data as
        | { type?: string; message?: string }
        | undefined;
      if (data?.type === "error") {
        toast.error(data.message);
      }
      if (data?.type === "info") {
        toast.info(data.message);
      }
      if (data?.type === "warning") {
        toast.warning(data.message);
      }
      if (data?.type === "catchError") {
        toast.error(data.message);
      }
    },
  });
  const HandleNewsLetterEmail = () => {
    const email = NewsLetterEmail.current?.value;
    if (email) subscribeMutation.mutate(email);
  };
  return (
    <PresentationalSubscriptionFrom
      NewsLetterEmail={NewsLetterEmail}
      HandleNewsLetterEmail={HandleNewsLetterEmail}
    />
  );
};
export default Page;

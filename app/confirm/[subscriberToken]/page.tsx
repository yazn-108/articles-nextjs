"use client";
import GoBackToHome from "@/app/_components/GoBackToHome";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React, { use, useEffect, useState } from "react";
const Page = ({ params }: { params: Promise<{ subscriberToken: string }> }) => {
  const { subscriberToken } = use(params);
  const [ResponseMessage, setResponseMessage] = useState<string>("");
  const subscribeMutation = useMutation({
    mutationFn: () =>
      axios.post("/api/confirm", {
        token: subscriberToken,
      }),
    onSuccess: (res) => {
      setResponseMessage(res.data.message);
    },
    onError: (err: AxiosError) => {
      const message = (err.response?.data as { message?: string })?.message;
      setResponseMessage(message!);
    },
  });
  useEffect(() => {
    subscribeMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className="min-h-dvh flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-2xl">حياك الله</h1>
        {ResponseMessage ? (
          <h2 className="text-xl">{ResponseMessage}</h2>
        ) : (
          "جار التحقق..."
        )}
        <GoBackToHome>
          <GoBackToHome.BackToHome />
        </GoBackToHome>
      </div>
    </section>
  );
};
export default Page;

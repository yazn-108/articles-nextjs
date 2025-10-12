"use client";
import GoBackToHome from "@/app/_components/GoBackToHome";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React, { use } from "react";
import { toast, Toaster } from "sonner";
const Page = ({ params }: { params: Promise<{ subscriberToken: string }> }) => {
  const { subscriberToken } = use(params);
  const subscribeMutation = useMutation({
    mutationFn: () =>
      axios.post("/api/unsubscribe", {
        token: subscriberToken,
      }),
    onSuccess: (res) => {
      toast.success(res.data.message);
    },
    onError: (err: AxiosError) => {
      const data = err.response?.data as { message?: string };
      toast.error(data?.message);
    },
  });
  return (
    <section className="min-h-dvh flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-2xl">لكل بداية نهاية</h1>
        <p>يؤسفنا مغادرتك ولكن مرحب بعودتك في اي وقت</p>
        <button
          onClick={() => subscribeMutation.mutate()}
          className={`block mt-5 py-2 px-5 bg-primary rounded-md mx-auto cursor-pointer`}
        >
          الغاء الاشتراك
        </button>
        <GoBackToHome>
          <GoBackToHome.BackToHome />
        </GoBackToHome>
      </div>
      <Toaster position="bottom-right" />
    </section>
  );
};
export default Page;

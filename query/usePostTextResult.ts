"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { postTextResult, type PostTextResultPayload } from "@/lib/api/postTextResult";

type PayloadWithoutUserId = Omit<PostTextResultPayload, "user_id">;

export function usePostTextResult() {
  const { data: session, status } = useSession();
  const userId = session?.user?.user_id;

  return useMutation({
    mutationFn: (payload: PayloadWithoutUserId) => {
      // console.log("✅ postTextResult CALLED");
      if (status !== "authenticated" || !userId) {
        throw new Error("로그인이 필요합니다");
      }
      return postTextResult({
        ...payload,
        user_id: Number(userId),
      });
    },
    // ✅ 성공했을 때
    // onSuccess: (data) => {
    //     console.log("✅ POST SUCCESS", data);
    // },

    // ✅ 실패했을 때
    // onError: (error) => {
    //     console.log("❌ POST FAILED", error);
    // },    
  });
}
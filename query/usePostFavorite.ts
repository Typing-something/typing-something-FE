// query/usePostFavorite.ts
import { useMutation } from "@tanstack/react-query";
import {
  postFavorite,
  PostFavoritePayload,
  PostFavoriteResponse,
} from "@/lib/api/postFavorite";

export function usePostFavorite() {
  return useMutation<
    PostFavoriteResponse,
    Error,
    PostFavoritePayload
  >({
    mutationFn: postFavorite,
  });
}
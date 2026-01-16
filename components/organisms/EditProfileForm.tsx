"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type EditProfileSubmitPayload = {
  name: string;
  /** 새 이미지를 선택했을 때만 File이 들어옴 */
  imageFile?: File | null;
};

type Props = {
  initialName: string;
  initialImageUrl?: string | null;

  onCancel: () => void;
  onSubmit: (payload: EditProfileSubmitPayload) => Promise<void> | void;
};

export default function EditProfileForm({
  initialName,
  initialImageUrl,
  onCancel,
  onSubmit,
}: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(initialName ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl ?? null);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 파일 미리보기 URL 관리
  useEffect(() => {
    if (!imageFile) return;

    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  const trimmedName = name.trim();

  const isNameValid = trimmedName.length >= 2 && trimmedName.length <= 12; // 너 기준에 맞게 조절
  const isDirty = useMemo(() => {
    const nameChanged = trimmedName !== (initialName ?? "").trim();
    const imgChanged = !!imageFile;
    return nameChanged || imgChanged;
  }, [trimmedName, initialName, imageFile]);

  const handlePickImage = () => fileRef.current?.click();

  const handleFileChange = (f?: File | null) => {
    if (!f) return;
    // 필요하면 타입/용량 제한 추가
    setImageFile(f);
    setError(null);
  };

  const handleRemoveNewImage = () => {
    setImageFile(null);
    setPreviewUrl(initialImageUrl ?? null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    setError(null);

    if (!isNameValid) {
      setError("이름은 2~12자 사이로 입력하시오.");
      return;
    }
    if (!isDirty) {
      onCancel();
      return;
    }

    try {
      setIsSaving(true);
      await onSubmit({ name: trimmedName, imageFile });
      // 성공하면 부모에서 모달 닫아도 되고,
      // 여기서 닫고 싶으면: onCancel();
    } catch (e: any) {
      setError(e?.message ?? "저장 중 오류가 발생했어요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 이미지 */}
      <section className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="프로필 이미지 미리보기"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-sm font-semibold text-neutral-500">
              {trimmedName ? trimmedName.slice(0, 1) : "?"}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="text-sm font-semibold text-neutral-900">프로필 이미지</div>
          <div className="mt-1 text-xs text-neutral-500">
            JPG/PNG 
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePickImage}
              className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50"
            >
              이미지 변경
            </button>

            {imageFile && (
              <button
                type="button"
                onClick={handleRemoveNewImage}
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              >
                선택 취소
              </button>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          />
        </div>
      </section>

      {/* 이름 */}
      <section className="space-y-2">
        <label className="text-sm font-semibold text-neutral-900">이름</label>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          placeholder="이름을 입력해줘"
          className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400"
        />
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>2~12자</span>
          <span className={trimmedName.length > 12 ? "text-red-500" : ""}>
            {trimmedName.length}/12
          </span>
        </div>
      </section>

      {/* 에러 */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* 액션 */}
      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="inline-flex h-10 items-center justify-center rounded-full border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
        >
          취소
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving || !isNameValid}
          className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          {isSaving ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
}
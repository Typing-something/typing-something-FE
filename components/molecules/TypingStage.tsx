"use client";

import { RefObject } from "react";
import { TypingDisplay } from "./TypingDisplay";
import { TypingInput } from "../atoms/TypingInput";

type Props = {
  text: string;
  input: string;
  cursorIndex: number;
  onFocusRequest: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
  onChangeInput: (v: string) => void;
};

export function TypingStage({
  text,
  input,
  cursorIndex,
  onFocusRequest,
  inputRef,
  onChangeInput,
}: Props) {
  return (
    <div className="relative px-6 py-8 space-y-4 cursor-text" onClick={onFocusRequest}>
      <TypingDisplay text={text} input={input} cursorIndex={cursorIndex} />
      <TypingInput ref={inputRef} value={input} onChange={onChangeInput} />
    </div>
  );
}
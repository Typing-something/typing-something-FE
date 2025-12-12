"use client";

type TypingDisplayProps = {
    text: string;   // 윈본 가사
    input: string; // 사용자가 타이핑한 글자
    cursorIndex: number;
}

export function TypingDisplay({text, input, cursorIndex}: TypingDisplayProps){
    const safeText = text ?? "";
    const chars = safeText.split("");

    return(
        <div className="flex flex-wrap gap-[2px] text-lg leading-7">
            {safeText.split("").map((char, index) => {
                const typed = input[index];

                let color = "text-neutral-400"
                if(typed != null){
                    color = typed === char ? "text-neutral-900" : "text-red-500"
                }
                const isCursorHere = index === cursorIndex;

                return(
                    <span key={index} >
                        {isCursorHere && (
                            <span className="inline-block w-[2px] h-[1.3em] bg-blue-500 align-middle animate-pulse mr-[1px]"></span>
                        )}
                        <span className={color}>{char}</span>
                    </span>
                )
            })}
            {/* 커서가 "맨 끝"에 있을 때(마지막 글자 뒤) */}
            {cursorIndex === chars.length && (
                <span className="inline-block w-[2px] h-[1.3em] bg-blue-500 align-middle animate-pulse ml-[1px]" />
            )}
        </div>
    )
}
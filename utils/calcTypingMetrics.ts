export type TypingMetrics = {
    elapsedMs: number;
    cpm: number;
    wpm: number;
    acc: number; // 0 ~ 100
}

export function calcTypingMetrics(
    text: string,
    input: string,
    startedAt: number | null,
    isComposing: boolean,
): TypingMetrics {
    if(!startedAt){
        return {elapsedMs: 0, cpm: 0, wpm: 0, acc: 100};
    }

    const now = Date.now();
    const elapsedMs = Math.max(1, now - startedAt);
    const elapsedMin = elapsedMs / 60000;

    const comparableLen = Math.max(
        0,
        Math.min(text.length, input.length - (isComposing ? 1 : 0))
    )
    let correct = 0;
    for (let i = 0; i < comparableLen; i++){
        if(input[i] === text[i]) correct++;
    }
    const typedChars = input.length;
    const cpm = Math.round(typedChars / elapsedMin);
    const wpm = Math.round((typedChars / 5) / elapsedMin);
    const acc =
    comparableLen === 0 ? 100 : Math.round((correct / comparableLen) * 100);

    return {
        elapsedMs,
        cpm: isFinite(cpm) ? cpm : 0,
        wpm: isFinite(wpm) ? wpm : 0,
        acc,
    }
}
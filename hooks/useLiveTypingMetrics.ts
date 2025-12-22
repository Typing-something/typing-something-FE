import { useEffect, useMemo, useRef, useState } from "react";
import { calcTypingMetrics, TypingMetrics } from "@/utils/calcTypingMetrics";

type Sample = { t: number; len: number };

export function useLiveTypingMetrics(
  text: string,
  input: string,
  isComposing: boolean
) {
  const startedAtRef = useRef<number | null>(null);

  // ✅ 렌더 트리거(시간 흐름)
  const [tick, setTick] = useState(0);

  // ✅ 최근 입력 길이 샘플(슬라이딩 윈도우용)
  const samplesRef = useRef<Sample[]>([]);

  // ✅ 속도 감쇠(떨어지는 속도) 조절: 3~5초 추천
  const windowMs = 4_000;

  // 첫 입력 시 시작 시간 고정
  useEffect(() => {
    if (!startedAtRef.current && input.length > 0) {
      startedAtRef.current = Date.now();
    }
  }, [input.length]);

  // input 변화 시점마다 샘플 기록
  useEffect(() => {
    const now = Date.now();
    samplesRef.current.push({ t: now, len: input.length });

    // 너무 길어지지 않게 컷
    if (samplesRef.current.length > 2000) {
      samplesRef.current.splice(0, 1000);
    }
  }, [input.length]);

  // 200ms tick → 실시간 갱신 (더 매끈하게 하고 싶으면 100으로)
  useEffect(() => {
    const id = setInterval(() => {
      setTick((v) => v + 1);
    }, 200);

    return () => clearInterval(id);
  }, []);

  const metrics: TypingMetrics = useMemo(() => {
    const base = calcTypingMetrics(text, input, startedAtRef.current, isComposing);
  
    const now = Date.now();
    const from = now - windowMs;
    const samples = samplesRef.current;
  
    while (samples.length && samples[0].t < from) {
      samples.shift();
    }
  
    if (samples.length >= 2) {
      const first = samples[0];
      const last = samples[samples.length - 1];
  
      // ✅ 마지막 입력이 윈도우 밖이면 0
      if (now - last.t >= windowMs) {
        return { ...base, cpm: 0, wpm: 0 };
      }
  
      // ✅ 핵심: 분모를 last.t가 아니라 now로
      const dtMin = Math.max(0.001, (now - first.t) / 60000);
      const dLen = Math.max(0, last.len - first.len);
  
      const cpm = Math.round(dLen / dtMin);
      const wpm = Math.round((dLen / 5) / dtMin);
  
      return { ...base, cpm, wpm };
    }
  
    return { ...base, cpm: 0, wpm: 0 };
  }, [text, input, isComposing, tick]);

  const resetMetrics = () => {
    startedAtRef.current = null;
    samplesRef.current = [];
    setTick(0);
  };

  return { metrics, resetMetrics };
}
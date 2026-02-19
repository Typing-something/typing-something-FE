import { useEffect, useMemo, useRef, useState } from "react";
import { parseTypingLine } from "@/utils/parseTypingLine";

export type TypingMetrics = {
  elapsedMs: number;
  cpm: number;
  wpm: number;
  acc: number; // 0 ~ 100
};

export type MetricSnapshot = { second: number; wpm: number; acc: number };

type Sample = { t: number; len: number };

export function useLiveTypingMetrics(
  lineText: string,
  input: string,
  isComposing: boolean
) {
  const startedAtRef = useRef<number | null>(null);
  const [tick, setTick] = useState(0);
  const samplesRef = useRef<Sample[]>([]);
  const snapshotsRef = useRef<MetricSnapshot[]>([]);
  const lastSnapshotSecRef = useRef(-1);
  const windowMs = 4_000;

  // "확정 입력 길이" (조합중 마지막 1글자 제외)
  const stableLen = Math.max(0, input.length - (isComposing ? 1 : 0));

  // 첫 입력 시 시작 시간 고정 + 0초 스냅샷 삽입
  useEffect(() => {
    if (!startedAtRef.current && stableLen > 0) {
      startedAtRef.current = Date.now();
      snapshotsRef.current.push({ second: 0, wpm: 0, acc: 100 });
      lastSnapshotSecRef.current = 0;
    }
  }, [stableLen]);

  // 입력 변화 시 샘플 기록 (stableLen 기준)
  useEffect(() => {
    const now = Date.now();
    samplesRef.current.push({ t: now, len: stableLen });

    if (samplesRef.current.length > 2000) {
      samplesRef.current.splice(0, 1000);
    }
  }, [stableLen]);

  // tick
  useEffect(() => {
    const id = setInterval(() => setTick((v) => v + 1), 200);
    return () => clearInterval(id);
  }, []);

  const metrics: TypingMetrics = useMemo(() => {
    // 시작 전
    if (!startedAtRef.current) {
      return { elapsedMs: 0, cpm: 0, wpm: 0, acc: 100 };
    }

    const now = Date.now();
    const elapsedMs = Math.max(1, now - startedAtRef.current);
    const elapsedMin = elapsedMs / 60000;

    // =========================================================
    // ACC 계산 (기존 correct/wrong/comparable 로직 "대신")
    // =========================================================
    const stableInput =
      stableLen === input.length ? input : input.slice(0, stableLen);

    const parsed = parseTypingLine(lineText, stableInput, 5);

    let wrongCount = 0;
    for (const s of parsed.states) {
      if (s === "wrong") wrongCount++;
      //if (s === "skipped") wrongCount++; // 원하면 벌점 포함
    }

    const total = Math.max(1, lineText.length);
    const acc = Math.max(
      0,
      Math.min(100, Math.round((1 - wrongCount / total) * 100))
    );
    // =========================================================

    // WPM/CPM: 안정 입력 길이 기준(정책)
    const typedChars = stableLen;
    const baseCpm = Math.round(typedChars / elapsedMin);
    const baseWpm = Math.round((typedChars / 5) / elapsedMin);

    // 슬라이딩 윈도우 속도 (기존 방식 유지)
    const from = now - windowMs;
    const samples = samplesRef.current;

    while (samples.length && samples[0].t < from) samples.shift();

    let finalWpm: number;
    let finalCpm: number;

    if (samples.length >= 2) {
      const first = samples[0];
      const last = samples[samples.length - 1];

      if (now - last.t >= windowMs) {
        finalWpm = 0;
        finalCpm = 0;
      } else {
        const dtMin = Math.max(0.001, (now - first.t) / 60000);
        const dLen = Math.max(0, last.len - first.len);
        finalCpm = Math.round(dLen / dtMin);
        finalWpm = Math.round((dLen / 5) / dtMin);
      }
    } else {
      finalCpm = isFinite(baseCpm) ? baseCpm : 0;
      finalWpm = isFinite(baseWpm) ? baseWpm : 0;
    }

    // 1초 단위 스냅샷 수집 (WPM 상한 150 클램핑 — 초반 노이즈 방지)
    const currentSec = Math.floor(elapsedMs / 1000);
    if (currentSec > lastSnapshotSecRef.current) {
      lastSnapshotSecRef.current = currentSec;
      const clampedWpm = Math.min(finalWpm, 120);
      snapshotsRef.current.push({ second: currentSec, wpm: clampedWpm, acc });
    }

    return { elapsedMs, cpm: finalCpm, wpm: finalWpm, acc };
  }, [lineText, input, stableLen, isComposing, tick]);

  const resetMetrics = () => {
    startedAtRef.current = null;
    samplesRef.current = [];
    snapshotsRef.current = [];
    lastSnapshotSecRef.current = -1;
    setTick(0);
  };

  return { metrics, snapshots: snapshotsRef.current, resetMetrics };
}
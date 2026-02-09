export function splitLines(text: string): string[] {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
}

export function normalizeInputLines(lines: string[], rawInput: string, maxExtra = 5): string {
  let line = 0;
  let col = 0;
  let out = "";
  const extraCountBySpace: Record<string, number> = {};

  const curLineText = () => lines[line] ?? "";

  for (let k = 0; k < rawInput.length; k++) {
    const u = rawInput[k];

    // 핵심: 입력에 이미 들어온 '\n'은 무조건 다음 줄로 이동
    if (u === "\n") {
      out += "\n";
      line++;
      col = 0;
      continue;
    }

    if (line >= lines.length) break;

    const textLine = curLineText();

    // 라인 끝에서 Space 누르면 다음 줄로(=Space=Enter)
    if (col >= textLine.length) {
      if (u === " ") {
        out += "\n";
        line++;
        col = 0;
      }
      continue;
    }

    const t = textLine[col];

    // 타겟이 space인 자리(extra 정책)
    if (t === " ") {
      if (u === " ") {
        out += " ";
        col++;
      } else {
        const key = `${line}:${col}`;
        const cnt = extraCountBySpace[key] ?? 0;
        if (cnt < maxExtra) {
          out += u;
          extraCountBySpace[key] = cnt + 1;
        }
      }
      continue;
    }

    // user가 space: 같은 줄에서만 다음 space(또는 라인 끝)로 스킵
    if (u === " ") {
      const nextSpace = textLine.indexOf(" ", col);
      out += " ";
      col = nextSpace === -1 ? textLine.length : nextSpace + 1;
      continue;
    }

    // 일반 문자
    out += u;
    col++;
  }

  return out;
}

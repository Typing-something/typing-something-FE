type CellState = "correct" | "wrong" | "untyped" | "skipped";
type ExtraPos = { spaceIndex: number; offset: number };
type Parsed = {
    states: CellState[];
    typedAt: (string | null)[];
    extrasBeforeSpace: Record<number, string>;
    cursorIndex: number;
  
    inputToText: number[];
    inputToExtra: (ExtraPos | null)[];
  };
  

export function parseTypingLine(text: string, input: string, maxExtra = 5): Parsed {
    const n = text.length;
    const states: CellState[] = Array(n).fill("untyped");
    const typedAt: (string | null)[] = Array(n).fill(null);
    const extrasBeforeSpace: Record<number, string> = {};
  
    const inputToText: number[] = Array(input.length).fill(-1);
    const inputToExtra: (ExtraPos | null)[] = Array(input.length).fill(null);
  
    let i = 0;
    let j = 0;
  
    const findNextSpace = (from: number) => {
      const idx = text.indexOf(" ", from);
      return idx === -1 ? n : idx;
    };
  
    while (i < n && j < input.length) {
      const t = text[i];
      const u = input[j];
  
      if (t === " ") {
        if (u === " ") {
          states[i] = "correct";
          inputToText[j] = i;
          inputToExtra[j] = null;
          i++;
          j++;
        } else {
          const prev = extrasBeforeSpace[i] ?? "";
          if (prev.length < maxExtra) {
            extrasBeforeSpace[i] = prev + u;
            inputToText[j] = -1;
            inputToExtra[j] = { spaceIndex: i, offset: prev.length };
          }
          j++;
        }
        continue;
      }
  
      if (u === " ") {
        const nextSpace = findNextSpace(i);
        for (let k = i; k < nextSpace; k++) {
          if (states[k] === "untyped") states[k] = "skipped";
        }
        if (nextSpace < n && text[nextSpace] === " ") {
          states[nextSpace] = "correct";
          inputToText[j] = nextSpace;
          i = nextSpace + 1;
        } else {
          i = nextSpace;
        }
        j++;
        continue;
      }
  
      typedAt[i] = u;
      states[i] = u === t ? "correct" : "wrong";
      inputToText[j] = i;
      j++;
      i++;
    }
  
    return {
      states,
      typedAt,
      extrasBeforeSpace,
      cursorIndex: i,
      inputToText,
      inputToExtra,
    };
  }
  

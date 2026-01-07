export type PostTextResultPayload = {
    text_id: number;
    user_id: number;
    cpm: number;
    wpm: number;
    accuracy: number;
    combo: number;
  };
  
  export async function postTextResult(payload: PostTextResultPayload) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/text/results`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
  
    if (!res.ok) {
      throw new Error("결과 저장 실패");
    }
  
    return res.json();
  }
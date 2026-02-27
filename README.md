# TypeSomething

> 노래 가사 타이핑 웹

[배포 링크](https://typesomething.vercel.app)

## 프로젝트 소개

TypeSomething은 음악 가사를 타이핑하는 방식으로
타자 연습을 할 수 있는 웹 애플리케이션입니다.

사용자는 가사를 따라 입력하며 자신의 타이핑 속도와 정확도를
확인할 수 있습니다.

## 시연 영상

<table>
  <tr>
    <td align="center" width="50%"><b>타이핑</b><br><video src="https://github.com/user-attachments/assets/da4b4f79-0025-4caf-9bdd-61222b8b5646" /></td>
    <td align="center" width="50%"><b>곡 무한 페치</b><br><video src="https://github.com/user-attachments/assets/7e60fc2f-48f1-4b88-96df-8175fa7bf3e5" /></td>
  </tr>
  <tr>
    <td align="center" width="50%"><b>마이페이지</b><br><video src="https://github.com/user-attachments/assets/d71b3464-542d-440c-8d93-e6eaac27d863" /></td>
    <td align="center" width="50%"><b>리더보드</b><br><video src="https://github.com/user-attachments/assets/787d274c-291e-482c-8e29-096309feeb35" /></td>
  </tr>
</table>

## 주요 기능

- 랜덤 곡 기반 타이핑 진행
  - 곡을 10개씩 랜덤으로 불러와 타이핑 리스트를 구성
  - 8번째 곡을 타이핑 중일 경우, 새로운 랜덤 곡 10개를 추가로 불러와
    리스트에 자연스럽게 이어서 제공
  - 사용자가 타이핑을 멈추지 않고 이어서 진행할 수 있도록 흐름을 고려해 설계

- 실시간 타이핑 지표 제공
  - 입력 중 타이핑 속도(WPM, CPM)와 정확도를 실시간으로 확인
  - 타이핑 종료 후에는 결과를 모달로 분리해
    입력 과정과 결과 확인 경험을 명확히 구분
  - 결과 모달에서 WPM/ACC 추이를 시계열 차트로 시각화 (ECharts)

- 결과 기록 처리
  - 로그인 여부에 따라 결과 저장 책임을 분리
  - 로그인한 사용자의 경우 타이핑 결과를 서버에 저장
  - 비로그인 사용자는 결과를 모달에서 즉시 확인 가능

- 곡 좋아요 기능
  - 곡에 좋아요를 눌러 관심 곡으로 표시

- 리더보드(랭킹) 조회
  - 사용자들의 타이핑 기록을 기반으로 한 랭킹 확인 가능

- 마이페이지
  - 내가 타이핑한 곡 목록 조회
  - 개인 타이핑 기록 확인

## 기술 스택

### Frontend
- **Framework**: Next.js 16 (App Router), React 19
- **State Management**: Zustand, TanStack Query
- **Styling**: Tailwind CSS 4
- **Chart**: ECharts (Canvas 렌더링)
- **Animation**: Motion
- **Authentication**: NextAuth.js (Google OAuth 2.0)
- **Deployment**: Vercel


## 프로젝트 구조

Atomic Design 패턴을 적용하여 컴포넌트의 재사용성과 관심사 분리를 고려했습니다.

```
├── app/                    # Next.js App Router (페이지 + API Routes)
│   ├── api/                # API Route Handlers (프록시)
│   ├── leaderboard/        # 리더보드 페이지
│   ├── login/              # 로그인 페이지
│   ├── my/                 # 마이페이지
│   └── page.tsx            # 메인 타이핑 페이지
│
├── components/
│   ├── atoms/              # 최소 단위 UI (Avatar, Button, Logo 등)
│   ├── molecules/          # 조합 UI (ResultModal, TypingStage, TypingResultChart 등)
│   └── organisms/          # 페이지 섹션 (SongTypeBoard, LeaderboardList, SettingsSidebar 등)
│
├── hooks/                  # 커스텀 훅 (useLiveTypingMetrics, usePrefetchSongs 등)
├── lib/api/                # API 호출 함수
├── query/                  # React Query 훅
├── stores/                 # Zustand 상태 관리
├── types/                  # 타입 정의
└── utils/                  # 유틸리티 함수 (parseTypingLine 등)
```

## 아키텍처

![Architecture](https://github.com/user-attachments/assets/51676c1f-05a5-401e-912b-e928b790970e)

## 실행 방법

```bash
# 설치
npm install

# 개발 서버 실행
npm run dev
```

## 환경 변수

| 변수명 | 설명 |
|--------|------|
| `EXAMPLE_KEY` | 설명 |

## 팀원

| 이름 | 역할 | GitHub |
|------|------|--------|
| 권민성 | Frontend / Deployment | https://github.com/msms804 |
| 조정민 | Backend / DB / Infra | https://github.com/JOJoungMin |

## 관련 링크

- [Backend Repository](https://github.com/Typing-something/Flask_Api_Server)
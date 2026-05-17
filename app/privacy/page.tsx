import type { Metadata } from "next";
import { LegalPageShell } from "@/components/molecules/LegalPageShell";
import { SERVICE_CONTACT_EMAIL } from "@/lib/constants/contact";

export const metadata: Metadata = {
  title: "개인정보처리방침 | TypeSomething",
  description: "TypeSomething 개인정보처리방침",
};

const LAST_UPDATED = "2026년 5월 17일";

export default function PrivacyPage() {
  return (
    <LegalPageShell title="개인정보처리방침" lastUpdated={LAST_UPDATED}>
      <section>
        <h2 className="text-base font-semibold text-neutral-900">
          1. 개요
        </h2>
        <p className="mt-3">
          TypeSomething(이하 &quot;서비스&quot;)는 이용자의 개인정보를
          중요하게 생각하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.
          본 방침은 서비스 이용 시 수집·이용되는 개인정보와 쿠키(광고 포함)
          처리에 대해 설명합니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-neutral-900">
          2. 수집하는 개인정보 항목
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong>Google 로그인 시:</strong> 이메일, 이름, 프로필 이미지,
            Google 계정 식별자(OAuth를 통해 제공되는 범위 내)
          </li>
          <li>
            <strong>서비스 이용 시:</strong> 타이핑 기록(WPM, CPM, 정확도 등),
            즐겨찾기 정보, 접속 로그, IP 주소, 브라우저·기기 정보
          </li>
          <li>
            <strong>자동 수집:</strong> 쿠키, 광고 식별자, 이용 통계 데이터
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-semibold text-neutral-900">
          3. 개인정보의 수집 및 이용 목적
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>회원 인증 및 계정 관리</li>
          <li>타이핑 연습, 기록 저장, 랭킹·마이페이지 제공</li>
          <li>서비스 개선, 오류 분석, 보안 유지</li>
          <li>맞춤형 광고 제공 및 광고 성과 측정(Google AdSense 등)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-semibold text-neutral-900">
          4. Google AdSense 및 광고 쿠키
        </h2>
        <p className="mt-3">
          본 서비스는 Google AdSense를 통해 광고를 게재할 수 있으며, 이
          과정에서 Google 및 제휴사가 쿠키를 사용하여 이용자의 이전 방문
          기록 등을 바탕으로 맞춤 광고를 제공할 수 있습니다.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            Google의 광고 쿠키 사용에 대한 자세한 내용은{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-neutral-900"
            >
              Google 광고 정책
            </a>
            을 참고하세요.
          </li>
          <li>
            맞춤 광고를 원하지 않으시면{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-neutral-900"
            >
              Google 광고 설정
            </a>
            에서 비활성화할 수 있습니다.
          </li>
          <li>
            또한{" "}
            <a
              href="https://optout.aboutads.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-neutral-900"
            >
              aboutads.info
            </a>
            에서 제3자 광고 쿠키를 거부할 수 있습니다.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-semibold text-neutral-900">
          5. 쿠키의 사용
        </h2>
        <p className="mt-3">
          서비스는 로그인 세션 유지, 이용 환경 설정, 트래픽 분석, 광고
          게재를 위해 쿠키 및 유사 기술을 사용합니다. 브라우저 설정에서
          쿠키 저장을 거부할 수 있으나, 일부 기능이 제한될 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-neutral-900">
          6. 보관 기간
        </h2>
        <p className="mt-3">
          개인정보는 수집·이용 목적이 달성될 때까지 보관하며, 관련 법령에
          따라 보존이 필요한 경우 해당 기간 동안 보관합니다. 회원 탈퇴
          요청 시 지체 없이 파기합니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-neutral-900">
          7. 제3자 제공
        </h2>
        <p className="mt-3">
          원칙적으로 이용자의 동의 없이 개인정보를 제3자에게 제공하지
          않습니다. 다만 법령에 따른 요청, Google OAuth·AdSense·호스팅
          등 서비스 운영에 필요한 범위 내 처리 위탁은 예외로 합니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-neutral-900">
          8. 이용자의 권리
        </h2>
        <p className="mt-3">
          이용자는 개인정보 열람, 정정, 삭제, 처리 정지를 요청할 수
          있습니다. 문의는 아래 연락처로 해 주세요.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-neutral-900">
          9. 문의
        </h2>
        <p className="mt-3">
          개인정보 관련 문의:{" "}
          <a
            href={`mailto:${SERVICE_CONTACT_EMAIL}`}
            className="underline underline-offset-2 hover:text-neutral-900"
          >
            {SERVICE_CONTACT_EMAIL}
          </a>
        </p>
      </section>
    </LegalPageShell>
  );
}

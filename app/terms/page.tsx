import type { Metadata } from "next";
import { LegalPageShell } from "@/components/molecules/LegalPageShell";
import { SERVICE_CONTACT_EMAIL } from "@/lib/constants/contact";

export const metadata: Metadata = {
  title: "이용약관 | TypeSomething",
  description: "TypeSomething 서비스 이용약관",
};

const LAST_UPDATED = "2026년 5월 17일";

export default function TermsPage() {
  return (
    <LegalPageShell title="이용약관" lastUpdated={LAST_UPDATED}>
      <section>
        <h2 className="text-base font-semibold text-neutral-900">
          1. 목적
        </h2>
        <p className="mt-3">
          본 약관은 TypeSomething(이하 &quot;서비스&quot;)이 제공하는
          가사 타이핑 연습 서비스의 이용 조건 및 절차, 이용자와 운영자의
          권리·의무를 규정함을 목적으로 합니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-neutral-900">
          2. 서비스 내용
        </h2>
        <p className="mt-3">
          서비스는 음악 가사를 활용한 타이핑 연습, 기록 저장, 랭킹 조회,
          마이페이지 등의 기능을 제공합니다. 운영자는 서비스의 전부 또는
          일부를 변경·중단할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-neutral-900">
          3. 이용자의 의무
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>타인의 정보를 도용하거나 허위 정보를 등록하지 않습니다.</li>
          <li>서비스를 해킹·과부하 유발 등 정상 운영을 방해하지 않습니다.</li>
          <li>관련 법령 및 본 약관을 준수합니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-semibold text-neutral-900">
          4. 계정 및 로그인
        </h2>
        <p className="mt-3">
          Google OAuth를 통한 로그인을 제공할 수 있으며, 이용자는 본인
          계정의 관리 책임을 집니다. 비로그인 상태에서도 일부 기능을
          이용할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-neutral-900">
          5. 저작권
        </h2>
        <p className="mt-3">
          서비스 UI·소프트웨어에 대한 권리는 운영자에게 있습니다. 가사
          등 제3자 콘텐츠의 저작권은 각 권리자에게 귀속되며, 이용자는
          개인적·비상업적 연습 목적 범위 내에서 이용해야 합니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-neutral-900">
          6. 광고
        </h2>
        <p className="mt-3">
          서비스는 Google AdSense 등 제3자 광고를 게재할 수 있습니다.
          광고 클릭 및 제휴 링크 이용에 따른 거래는 이용자와 광고주
          간의 책임입니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-neutral-900">
          7. 면책
        </h2>
        <p className="mt-3">
          운영자는 천재지변, 시스템 장애, 제3자 서비스 오류 등으로 인한
          손해에 대해 법령이 허용하는 범위 내에서 책임을 제한합니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-neutral-900">
          8. 약관 변경
        </h2>
        <p className="mt-3">
          본 약관은 필요 시 개정될 수 있으며, 변경 사항은 본 페이지에
          게시합니다. 변경 후에도 서비스를 계속 이용하는 경우 변경된
          약관에 동의한 것으로 봅니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-neutral-900">
          9. 문의
        </h2>
        <p className="mt-3">
          서비스 이용 문의:{" "}
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

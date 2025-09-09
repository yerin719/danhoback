export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">개인정보처리방침</h1>
          <p className="text-sm text-muted-foreground">최종 업데이트: 2024년 12월 31일</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. 개인정보의 수집 및 이용 목적</h2>
          <div className="space-y-3">
            <p>
              단호박(이하 &ldquo;회사&rdquo;)은 다음의 목적을 위하여 개인정보를 처리합니다:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>회원가입 및 회원 관리</li>
              <li>서비스 제공 및 맞춤형 콘텐츠 추천</li>
              <li>고객 문의 및 지원 서비스</li>
              <li>서비스 개선 및 새로운 서비스 개발</li>
              <li>마케팅 및 광고 활용</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. 수집하는 개인정보의 항목</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">필수 수집 정보</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>이메일 주소</li>
                <li>사용자명(닉네임)</li>
                <li>프로필 정보 (선택사항)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">자동 수집 정보</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>IP 주소</li>
                <li>쿠키 및 세션 정보</li>
                <li>브라우저 정보</li>
                <li>접속 로그 및 이용 기록</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. 개인정보의 보유 및 이용 기간</h2>
          <div className="space-y-3">
            <p>
              회사는 개인정보 수집 및 이용목적이 달성된 후에는 예외 없이 해당 정보를 지체 없이 파기합니다.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>회원 탈퇴 시: 즉시 삭제 (단, 법령에 의해 보관이 의무화된 경우 제외)</li>
              <li>로그 데이터: 수집일로부터 1년</li>
              <li>마케팅 정보 수신 동의 철회 시: 즉시 삭제</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. 개인정보의 제3자 제공</h2>
          <div className="space-y-3">
            <p>
              회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 
              다만, 다음의 경우에는 예외로 합니다:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. 개인정보의 처리위탁</h2>
          <div className="space-y-3">
            <p>회사는 서비스 제공을 위해 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">수탁업체</th>
                    <th className="text-left py-2">위탁업무</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">Supabase</td>
                    <td className="py-2">데이터베이스 관리 및 인증 서비스</td>
                  </tr>
                  <tr>
                    <td className="py-2">Vercel</td>
                    <td className="py-2">웹사이트 호스팅 및 배포</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. 이용자의 권리와 행사 방법</h2>
          <div className="space-y-3">
            <p>이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>개인정보 처리현황 통지 요구</li>
              <li>개인정보 열람 요구</li>
              <li>개인정보 정정·삭제 요구</li>
              <li>개인정보 처리정지 요구</li>
            </ul>
            <p className="mt-3">
              권리 행사는 개인정보보호법 시행령 제41조제1항에 따라 서면, 전자우편 등을 통하여 하실 수 있으며, 
              회사는 이에 대해 지체없이 조치하겠습니다.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. 개인정보의 안전성 확보 조치</h2>
          <div className="space-y-3">
            <p>회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보 조치를 하고 있습니다:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>개인정보 취급 직원의 최소화 및 교육</li>
              <li>개인정보에 대한 접근 제한</li>
              <li>개인정보를 안전하게 저장·전송할 수 있는 암호화 기술 사용</li>
              <li>해킹 등에 대비한 기술적 대책</li>
              <li>개인정보 처리시스템 접속기록의 보관 및 위변조 방지 조치</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. 쿠키의 사용</h2>
          <div className="space-y-3">
            <p>
              회사는 개인화되고 맞춤화된 서비스를 제공하기 위해서 이용자의 정보를 저장하고 
              수시로 불러오는 쿠키(cookie)를 사용합니다.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>쿠키의 사용 목적: 이용자가 방문한 서비스와 웹사이트들에 대한 방문 및 이용형태를 파악</li>
              <li>쿠키의 설치·운영 및 거부: 웹브라우저 상단의 도구 &gt; 인터넷 옵션 &gt; 개인정보 메뉴에서 설정</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. 개인정보보호책임자</h2>
          <div className="space-y-3">
            <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다:</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <p><span className="font-medium">개인정보보호책임자:</span> 관리자</p>
                <p><span className="font-medium">연락처:</span> privacy@danhoback.com</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10. 개인정보처리방침의 변경</h2>
          <div className="space-y-3">
            <p>
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 
              변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">11. 개인정보 처리방침 버전</h2>
          <div className="space-y-3">
            <ul className="list-disc pl-6 space-y-1">
              <li>버전 1.0: 2024년 12월 31일 최초 제정</li>
            </ul>
          </div>
        </section>

        <div className="border-t pt-8 mt-12">
          <p className="text-sm text-muted-foreground text-center">
            본 방침에 대한 문의사항이 있으시면 privacy@danhoback.com으로 연락주시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
}
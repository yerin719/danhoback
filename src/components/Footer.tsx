import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 py-12 mt-16 pb-20 lg:pb-12">
      <div className="mx-auto max-w-5xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">릴라이즈</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>대표: 이예린</p>
              <p>사업자 등록번호: 547-63-00839</p>
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <div className="space-y-1 text-sm  text-gray-600">
              <p>이메일: support@danhobak.kr</p>
              <p>전화: 010-4305-0719</p>
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <div className="space-y-2 text-sm  text-gray-600">
              <div className="space-x-2">
                <Link href="/terms-of-service" className="text-gray-600 hover:text-gray-900">
                  이용약관
                </Link>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900">
                  개인정보처리방침
                </Link>
              </div>
              <p className="text-gray-500">© 2025 릴라이즈. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import ProfilePageContent from "@/features/profile/ProfilePageContent";
import { Suspense } from "react";

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-8 flex items-center justify-center">
          <div className="animate-pulse">로딩 중...</div>
        </div>
      }
    >
      <ProfilePageContent />
    </Suspense>
  );
}

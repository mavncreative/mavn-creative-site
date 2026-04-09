import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#050505]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#f4cf36] border-t-transparent" />
        </div>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}

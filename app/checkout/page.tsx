import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#050505]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#f4cf36] border-t-transparent" />
        </div>
      }
    >
      <CheckoutClient />
    </Suspense>
  );
}

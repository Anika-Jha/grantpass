"use client";

import { AnonAadhaarProvider } from "@anon-aadhaar/react";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const useTestAadhaar =
    process.env.NEXT_PUBLIC_USE_TEST_AADHAAR === "true";

  return (
    <AnonAadhaarProvider _useTestAadhaar={useTestAadhaar}>
      {children}
    </AnonAadhaarProvider>
  );
}
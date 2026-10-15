"use client";

import { LocalizedStatus } from "@/components/LocalizedStatus";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <LocalizedStatus kind="error" reset={reset} />;
}

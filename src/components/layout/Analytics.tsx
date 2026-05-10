"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ReactGA from "react-ga4";

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    ReactGA.initialize("G-9LC9D01ZTF");
  }, []);

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    ReactGA.send({
      hitType: "pageview",
      page: url,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTracker />
    </Suspense>
  );
}

"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ReactGA from "react-ga4";

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    ReactGA.initialize("G-9LC9D01ZTF");
  }, []);

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: pathname + searchParams.toString(),
    });
  }, [pathname, searchParams]);

  return null;
}

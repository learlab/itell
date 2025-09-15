import React from "react";
import { Elements } from "@itell/constants";

export function PageContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Elements.TEXTBOOK_MAIN
  return (
    <div
      id={Elements.TEXTBOOK_MAIN}
      className="min-h-screen !px-0 !pt-0 !pb-36"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr min(85ch, calc(100% - 64px)) 1fr",
      }}
    >
      {children}
    </div>
  );
}

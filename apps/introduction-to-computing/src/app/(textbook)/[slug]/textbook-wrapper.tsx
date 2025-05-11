import React from "react";

export function TextbookWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main
      id="textbook-wrapper"
      className="grid min-h-screen grid-cols-1 md:grid-cols-[1fr_3fr] lg:grid-cols-[360px_1fr]"
    >
      {children}
    </main>
  );
}

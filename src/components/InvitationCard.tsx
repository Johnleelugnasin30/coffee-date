import type { ReactNode } from "react";

export function InvitationCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`card ${className}`.trim()}>{children}</section>;
}

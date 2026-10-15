"use client";

type StatusValue =
  | "applied"
  | "screening"
  | "interviewing"
  | "offered"
  | "hired"
  | "rejected"
  | "withdrawn";

const STYLES: Record<
  StatusValue,
  { label: string; bg: string; fg: string; dot: string }
> = {
  applied: { label: "Applied", bg: "#1a1d26", fg: "#B5B7BD", dot: "#B5B7BD" },
  screening: { label: "Screening", bg: "#1a1d26", fg: "#9bb4ff", dot: "#3b82f6" },
  interviewing: { label: "Interviewing", bg: "#1a1d26", fg: "#9bb4ff", dot: "#3b82f6" },
  offered: { label: "Offered", bg: "#1a1d26", fg: "#FFC000", dot: "#FFC000" },
  hired: { label: "Hired", bg: "#0f2a1d", fg: "#10b981", dot: "#10b981" },
  rejected: { label: "Rejected", bg: "#2a1010", fg: "#ef4444", dot: "#ef4444" },
  withdrawn: { label: "Withdrawn", bg: "#1a1d26", fg: "#8a8c93", dot: "#8a8c93" },
};

export const ApplicantStatusBadge = ({ cellData }: { cellData?: unknown }) => {
  const v = typeof cellData === "string" ? (cellData as StatusValue) : "applied";
  const s = STYLES[v] ?? STYLES.applied;
  return (
    <span
      aria-label={`Status: ${s.label}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "3px 10px",
        borderRadius: "9999px",
        background: s.bg,
        color: s.fg,
        fontSize: "12px",
        fontWeight: 600,
        border: `1px solid ${s.dot}33`,
        lineHeight: 1.4,
      }}
    >
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: "6px",
          height: "6px",
          borderRadius: "9999px",
          background: s.dot,
        }}
      />
      {s.label}
    </span>
  );
};
